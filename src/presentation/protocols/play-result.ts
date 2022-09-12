import { BeastModel } from '../../domain/models';

export interface GameResult extends BetsResult {
  id_game: number;
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
}
