import { GameModel } from '../models';

export interface CreateGame {
  nextGame(): Promise<GameModel>;
}
