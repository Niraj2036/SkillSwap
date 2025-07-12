import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/email/email.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuthService } from './google-oauth.service';

@Module({
  imports:[EmailModule,PrismaModule,JwtModule],
  controllers: [AuthController],
  providers: [AuthService,GoogleAuthService]
})
export class AuthModule {}
