import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { SwapRequestsModule } from './swap-requests/swap-requests.module';

@Module({
  imports: [AuthModule,PrismaModule, EmailModule, SwapRequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
