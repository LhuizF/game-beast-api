import { PrismaClient } from '@prisma/client';
import { Bet, SaveBetRepository } from '../../../data/protocols/saveBetRepository';
import { BetModel } from '../../../domain/models/bet';

export class SaveBetPrismaRepository implements SaveBetRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(playBet: Bet): Promise<BetModel> {
    const bet = await this.cxt.bet.create({
      data: playBet
    });

    return bet;
  }
}
