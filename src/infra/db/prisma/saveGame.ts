import { PrismaClient } from '@prisma/client';
import { SaveGameRepository } from '../../../data/protocols';
import { GameModel } from '../../../domain/models';

export class SaveGamePrismaRepository implements SaveGameRepository {
  constructor(private readonly cxt: PrismaClient) {}
  async save(time: number): Promise<GameModel> {
    return await this.cxt.game.create({ data: { time } });
  }
}
