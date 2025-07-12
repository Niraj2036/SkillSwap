import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/middlewares/auth.middleware';
@Module({
  imports:[PrismaModule],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule implements NestModule{
   configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(AuthMiddleware)
    .forRoutes(UsersController);
  }
}
