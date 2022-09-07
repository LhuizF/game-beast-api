import { PrismaClient } from '@prisma/client';
import { BetModel, SaveBetRepository } from '../../../data/protocols/SaveBetRepository';
import { Bet } from '../../../domain/models/bet';

export class SaveBetPrismaRepository implements SaveBetRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(playBet: BetModel): Promise<Bet> {
    const bet = await this.cxt.bet.create({
      data: playBet
    });

    return bet;
  }
}
