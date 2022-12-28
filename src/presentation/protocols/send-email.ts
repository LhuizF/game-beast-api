import { GameResult } from './play-result';

export interface SendEmail {
  send(data: GameResult): void;
}
