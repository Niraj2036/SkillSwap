import { Injectable, BadRequestException,HttpException ,HttpStatus} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dtos/register.dto';
import { hashPassword } from 'src/utils/hash.util';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { GoogleAuthService } from './google-oauth.service';
import { LoginDto } from './dtos/login.dto';
import { EmailService } from 'src/email/email.service';
@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService,
    private readonly jwtservice:JwtService,
    private readonly googleAuthService:GoogleAuthService,
    private readonly emailservice:EmailService
  ) {}


async register(dto: RegisterUserDto) {
  const {
    name,
    email,
    profilePic,
    phone,
    location,
    profilePhoto,
    availability,
    password,
    offeredSkills,
    wantedSkills,
  } = dto;

  // Basic input validations
 
  try {
    const hashedPassword = await hashPassword(password);

    return await this.prisma.$transaction(async (tx) => {
      // Check if user already exists
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new HttpException('User with this email already exists', HttpStatus.CONFLICT);
      }

      // Step 1: Create or reuse skill IDs
      const getSkillIds = async (skills: string[]) => {
        const skillRecords = await Promise.all(
          skills.map(async (skillName) => {
            const existing = await tx.skill.findUnique({ where: { name: skillName } });
            if (existing) return existing;
            return tx.skill.create({ data: { name: skillName } });
          }),
        );
        return skillRecords.map((s) => s.id);
      };

      const offeredSkillIds = await getSkillIds(offeredSkills);
      const wantedSkillIds = await getSkillIds(wantedSkills);

      // Step 2: Create user
      const user = await tx.user.create({
        data: {
          name,
          email,
          profilePic,
          phone,
          location,
          profilePhoto,
          availability,
          password: hashedPassword,
          role: 'user',
        },
      });

      // Step 3: Link offered skills
      await tx.userOfferedSkill.createMany({
        data: offeredSkillIds.map((skillId) => ({
          userId: user.id,
          skillId,
        })),
        skipDuplicates: true,
      });

      // Step 4: Link wanted skills
      await tx.userWantedSkill.createMany({
        data: wantedSkillIds.map((skillId) => ({
          userId: user.id,
          skillId,
        })),
        skipDuplicates: true,
      });

      // Step 5: Create OTP
      const otpValue = crypto.randomInt(100000, 999999);
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      await tx.otps.create({
        data: {
          userId: user.id,
          email,
          otp: otpValue,
          reason: 'verify_user',
          expiry: expiryTime,
        },
      });

      // Step 6: Send OTP email
      await this.emailservice.sendOtpEmail(email, otpValue.toString(), user.name);

      return {
        message: 'User registered successfully',
        userId: user.id,
        email: user.email,
      };
    });
  } catch (error) {
    console.error('Register error:', error);
    throw new HttpException(
      error.message || 'Failed to register user',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

   async sendOtp(body: { email: string; reason: string }) {
    try {
      if (!body.email || !body.reason) {
        throw new HttpException('Email and reason are required', 400);
      }
      console.log('Sending OTP to:', body.email);
      const { email, reason } = body;
      const user = await this.prisma.user.findUnique({
        where:{
            email
        }
      });

      if (!user) throw new HttpException('User does not exist.', 400);
      const otpValue = crypto.randomInt(100000, 999999);
      console.log('OTP Value:', otpValue);
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

      await this.prisma.otps.create({
        data: {
          userId: user.id,
          email: email,
          otp: otpValue,
          reason,
          expiry: expiryTime,
        },
      });
      if (reason === 'verify_user') {
        this.emailservice.sendOtpEmail(email,otpValue.toString(),user.name);
      }
      if (reason === 'reset_pass') {
        this.emailservice.sendForgotPasswordOtp(email, otpValue.toString(),user.name);
      }


      return `OTP sent to ${email}. Please check your email for the OTP.`;
    } catch (error) {
      console.log("error",error)
      throw new HttpException(
        error.message || 'Failed to send OTP',
        error.status || 500,
      );
    }
  }

  async verifyOtp(body: { email: string; otp: string }) {
    try {
      const { email, otp } = body;

      const latestOtp = await this.getLatestOtp(email);
      try {
        await this.ensureOtpIsValid(latestOtp, otp);
      } catch (error) {
        throw new HttpException(
          error.message || 'Invalid OTP',
          error.status || HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.prisma.user.findUnique({
        where:{
            email,
        }
      });

      if (latestOtp.reason === 'verify_user') {
        await this.prisma.user.update({
            where:{
                id:user.id
            },data:{
                status:'ACTIVE'
            }
        })
        return {
          message: 'OTP verification successful. ',
          data: null,
        };
      }

      if (latestOtp.reason === 'reset_pass') {
        const token = await this.generatePasswordResetToken(
          user.id,
        );
        return {
          message:
            'OTP verification successful. Password reset token generated.',
          data: token,
        };
      }

      throw new HttpException('Invalid OTP reason.', HttpStatus.BAD_REQUEST);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to send OTP',
        error.status || 500,
      );
    }
  }
  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.verifyResetToken(token);
      const userId = BigInt(payload);
      const user = await this.prisma.user.findUnique({
        where:{
            id:userId
        }
      });
      const hashedPassword =
        await hashPassword(newPassword);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      
      return 'Password reset successful. You can now log in with your new password.';
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to reset password',
        error.status || 500,
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({where:{
        email:dto.email,
      }});

      if (user.status ==='INACTIVE') {
        throw new HttpException('Verification needed', HttpStatus.UNAUTHORIZED);
      }

      if (user.password) {
        const isPasswordValid = await this.comparePasswords(
          dto.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new HttpException(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
          );
        }
      } else {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      
      
      const payload = {
        userId: user.id.toString(),
        role: user.role,
      };

      const accessToken = this.jwtservice.sign(payload, {
        secret: process.env.JWT_SECRET,
      });

      return { accessToken, user:{
        id:user.id,
        name:user.name,
        role:user.role,
      }};
    } }catch (error) {
      throw new HttpException(
        error.message || 'Failed to login',
        error.status || 500,
      );
    }
  }

  async loginWithGoogle(token: string) {
    // Verify the Google access token and extract the email
    console.log("token in service:",token)
    console.log("login with google called")
    try {
      const data =
        await this.googleAuthService.validateGoogleAccessToken(token);
      const { email, given_name, family_name, picture } = data;
      if (!email) {
        throw new HttpException('Invalid Google access token', 401);
      }

      // Fetch the user details from the database
      let user = await this.prisma.user.findUnique({
        where:{
          email,
        }
      });
      if (!user) {
        throw new HttpException('User should sign up first',400);
      }

    

      // Generate the JWT token
      const payload = {
        userId: user.id.toString(),
        role: user.role,
      };

      const access_token = this.jwtservice.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      // Return the token
      return {
        access_token,
        user:{
          id:user.id,
          name:user.name,
          role:user.role,
        }
      };
    } catch (error) {
      console.log("error:",error)
      throw new HttpException(
        error.message || 'Failed to login with Google',
        error.status || 500,
      );
    }
  }
  async getLatestOtp(email: string) {
    const otp = await this.prisma.otps.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new HttpException('No OTP found for this email.', HttpStatus.BAD_REQUEST);
    }

    return otp;
  }

  async ensureOtpIsValid(otpRecord: any, inputOtp: string) {
    console.log('Validating OTP:', otpRecord.otp.toString(), inputOtp);

    if (new Date(otpRecord.expiry).getTime() < Date.now()) {
      throw new HttpException('Invalid OTP.', HttpStatus.BAD_REQUEST);
    }

    if (otpRecord.otp.toString() !== inputOtp) {
      throw new HttpException('Invalid OTP.', HttpStatus.BAD_REQUEST);
    }
    return;
  }
  async generatePasswordResetToken(userId: bigint) {
    const token = jwt.sign(
      { id: userId.toString() },
      process.env.JWT_PASS_RESET_SECRET || 'jwt_password_secret7890',
      {
        expiresIn: '15m',
      },
    );

    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    return token;
  }
  verifyResetToken(token: string) {
    try {
      console.log('Verifying token:', token);
      if (!token) {
        throw new HttpException('Token is required.', HttpStatus.BAD_REQUEST);
      }
      const id=jwt.verify(token,process.env.JWT_PASS_RESET_SECRET || 'jwt_password_secret7890') as { id: string };
      console.log('Decoded ID:', id);
      
      return id.id;
    } catch (err) {
      console.error('Token verification error:', err);
      throw new HttpException('Invalid or expired token.', HttpStatus.BAD_REQUEST);
    }
  }
  async comparePasswords(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  }

