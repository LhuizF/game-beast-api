import { BetModel } from '../../domain/models/bet';

export interface Bet {
  id_user: string;
  id_beast: number;
  points: number;
  platform: string;
  game_time: number;
}

export interface SaveBetRepository {
  save(userDate: Bet): Promise<BetModel>;
}
