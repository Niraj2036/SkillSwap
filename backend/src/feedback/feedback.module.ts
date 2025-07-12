import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports:[PrismaModule],
  controllers: [FeedbackController],
  providers: [FeedbackService]
})
export class FeedbackModule implements NestModule{
   configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(AuthMiddleware)
    .forRoutes(FeedbackController);
  }
}
