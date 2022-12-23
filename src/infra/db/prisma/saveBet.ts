import { PrismaClient } from '@prisma/client';
import { Bet, SaveBetRepository } from '../../../data/protocols';
import { BetModel } from '../../../domain/models';

export class SaveBetPrismaRepository implements SaveBetRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(playBet: Bet): Promise<BetModel> {
    const bet = await this.cxt.bet.create({
      data: playBet
    });

    return bet;
  }
}
