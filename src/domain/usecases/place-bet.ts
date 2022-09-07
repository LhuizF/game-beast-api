import { Bet } from '../models/Bet';

export interface PlayBetModel {
  id_user: string;
  id_beast: number;
  points: number;
  platform: string;
}

export interface PlaceBet {
  play(bet: PlayBetModel): Promise<Bet>;
}
