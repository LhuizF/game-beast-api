import { BeastModel, GameModel } from '../../domain/models';

export interface GameResult extends BetsResult {
  game: GameModel;
  beastWin: BeastModel;
}

export interface BetsResult {
  totalBets: number;
  winners: UserWin[];
  losers: number;
}

export interface UserWin {
  id: string;
  name: string;
  avatar: string;
  pointsBet: number;
  pointsReceived: number;
}

export interface PlayResult {
  play(): Promise<Result>;
  beastSelected(beasts: BeastModel[]): BeastModel;
}

export interface ErrorGame {
  date: Date;
  body: any;
}

export interface Result {
  isSuccess: boolean;
  data: GameResult | ErrorGame;
  channels: string[];
}
