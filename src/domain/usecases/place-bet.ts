import { BetModel } from '../models';

export interface PlayBetModel {
  id_user: string;
  id_beast: number;
  points: number;
  platform: string;
  id_game: number;
}

export interface PlaceBet {
  play(bet: PlayBetModel): Promise<BetModel>;
}
