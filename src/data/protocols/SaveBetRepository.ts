import { BetModel } from '../../domain/models';

export interface Bet {
  id_user: string;
  id_beast: number;
  id_game: number;
  points: number;
  platform: string;
}

export interface SaveBetRepository {
  save(userDate: Bet): Promise<BetModel>;
}
