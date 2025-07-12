import { Controller, Get, Post, Body, Patch, Param, Delete ,HttpException,Req,HttpCode,Query,HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiOperation,ApiQuery } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService:UsersService
  ) {}

  @Post('register')
    async register(@Body() dto: RegisterUserDto) {
      try {
         await this.authService.register(dto);
        return {
          success:true,
          statusCode:201,
          message:'Registration Successful,Otp has been sent to your email',
          data:null
        }
      } catch (error) {
        throw new HttpException(
          {
            success:false,
            statusCode: error.status || 400,
            message: error.message || 'Error registering user',
            data: null,
          },
          error.status || 400,
        );
      }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
        const {accessToken,user}= await this.authService.login(
        loginDto
        );
        return {
            success:true,
            statusCode:201,
            message:'logged in successfully',
            data:{accessToken,user}
        }
        } catch (error) {
        console.log('error created in controller');
        throw new HttpException(
            {
            success:false,
            statusCode: error.status || 400,
            message: error.message || 'Error logging in',
            data: null,
            },
            error.status || 400,
        );
        }
    }
    @Post('login-with-google')
  async LoginWithGoogle(@Body('token') token: string) {
    try {
      const result= await this.authService.loginWithGoogle(token);
      return {
        success:true,
        statusCode:200,
        message:'Logged in successfully',
        data:result
      }
    } catch (error) {
      console.log("error in controller:",error)
      throw new HttpException(
        {
          
          success:false,
          statusCode: error.status || 400,
          message: error.message || 'Error logging in with google',
          data: null,
        },
        error.status,
      );
    }
  }
  
  @Post('sendOTP')
  @HttpCode(200)
  async sendOtp(@Body() sendOtpDto: { email: string ,reason: string}) {
    try {
      console.log('inside send otp')
      const message = await this.authService.sendOtp(sendOtpDto);
      return {
        success:true,
        statusCode: 200,
        message,
        data: null,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          success:false,
          statusCode: error.status || 400,
          message: error.message || 'Failed to Send otp',
          data: null,
        },
        error.status || 400,
      );
    }
  }

  @Post('verifyOTP')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto:{ email: string; otp: string }) {
    console.log('api called')
    try {
      const { message, data } = await this.authService.verifyOtp(verifyOtpDto);
      return {
        success:true,
        statusCode: 200,
        message,
        data,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          success:false,
          statusCode: error.status || 400,
          message: error.message || 'Failed to verify otp.',
          data: null,
        },
        error.status || 400,
      );
    }
  }

  
  @Post('resetPassword')
  @HttpCode(200)
  async resetPassword(
    @Body() body: { newPassword :string,token:string} ,
  ) {
    try {
      if (!body || !body.newPassword || !body.token) {
        throw new HttpException(
          'New password and token are required.',
          400,
        );
      }
      const { newPassword, token } = body; // Destructure the body to get newPassword and token
      // Extract the Bearer token from the Authorization header
      if (!newPassword || !token) {
        throw new HttpException(
          'New password and token are required.',
          400,
        );
      }
      console.log('pass in controller:', newPassword);
      // Call the service to reset the password
      const message = await this.authService.resetPassword( token, newPassword);

      return {
        success:true,
        statusCode: 200,
        message,
        data: null,
      };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          success:false,
          statusCode: error.status || 400,
          message: error.message || 'Failed to reset password.',
          data: null,
        },
        error.status || 400,
      );
    }
  }
@Get()
  @ApiOperation({ summary: 'Get all users (excluding self), with filters' })
  @ApiQuery({ name: 'availability', required: false, type: [String] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAllUsers(
    @Req() req: any,
    @Query('availability') availability?: string | string[],
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    try {
      const currentUserId = BigInt(req.user.userId);
      return await this.userService.getAllUsers({
        currentUserId,
        availability,
        search,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    } catch (err) {
      console.error('Get Users Error:', err);
      throw new HttpException(
        'Failed to fetch users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
