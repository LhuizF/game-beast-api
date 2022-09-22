import { BetModel } from './bet';

export interface GameModel {
  id: number;
  time: number;
  result: number;
  created_at: Date;
  update_at: Date;
}

export interface GameWithBet extends GameModel {
  bets: BetModel[];
}
