import { PrismaClient } from '@prisma/client';
import { LogErrorRepository } from '../../../data/protocols/logErrorRepository';

export class LogErrorPrismaRepository implements LogErrorRepository {
  constructor(private readonly cxt: PrismaClient) {}
  async logError(stack: string): Promise<void> {
    await this.cxt.logError.create({
      data: { stack }
    });
  }
}
