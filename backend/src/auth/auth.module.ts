import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthService } from './google-oauth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[EmailModule,PrismaModule,JwtModule],
  controllers: [AuthController],
  providers: [AuthService,GoogleAuthService,UsersService]
})
export class AuthModule {}
