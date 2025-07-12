import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
      errorFormat: 'pretty',
    });

    if (PrismaService.instance) {
      return PrismaService.instance;
    }

    PrismaService.instance = this;
  }

  // Singleton pattern to ensure only one instance of Prisma is ever created
  static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  // Lifecycle hooks for connecting and disconnecting from the database
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Failed to disconnect from database:', error);
      throw error;
    }
  }

  // Helper method to enable graceful
  // shutdown of the application
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1;`;
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to execute a callback within a transaction block using Prisma
  async executeInTransaction<T>(
    callback: (
      prisma: Omit<
        PrismaClient,
        | '$connect'
        | '$disconnect'
        | '$on'
        | '$transaction'
        | '$use'
        | '$extends'
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (prisma) => {
      return callback(prisma);
    });
  }
}

//  Use the transaction helper like this:
// await this.prismaService.executeInTransaction(async (prisma) => {
//   const user = await prisma.user.create({
//     data: { name: 'John', email: 'john@example.com', password: 'hashedpw' }
//   });

//   await prisma.profile.create({
//     data: { userId: user.id, bio: 'New user bio' }
//   });

//   return user;
// });
