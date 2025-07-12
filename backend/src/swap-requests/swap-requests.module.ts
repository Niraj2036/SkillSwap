import { Module ,NestModule,MiddlewareConsumer} from '@nestjs/common';
import { SwapRequestsController } from './swap-requests.controller';
import { SwapRequestsService } from './swap-requests.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';

@Module({
  imports:[PrismaModule,EmailModule],
  controllers: [SwapRequestsController],
  providers: [SwapRequestsService]
})
export class SwapRequestsModule implements NestModule{
   configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(AuthMiddleware)
    .forRoutes(SwapRequestsController);
  }
}
