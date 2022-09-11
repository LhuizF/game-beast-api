export interface WinBeast {
  addWin(id: number, time: number): Promise<void>;
}
