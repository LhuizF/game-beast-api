import { BetsResult } from '../../presentation/protocols/play-result';

export interface WinBeast {
  addWin(idGame: number, idBeast: number): Promise<BetsResult>;
  getChannels(): Promise<string[]>;
}
