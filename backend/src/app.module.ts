import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { SwapRequestsModule } from './swap-requests/swap-requests.module';
import { FeedbackModule } from './feedback/feedback.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule,PrismaModule, EmailModule, SwapRequestsModule, FeedbackModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
