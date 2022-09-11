import { PlayResult } from '../protocols/play-result';
import { HelperDb } from '../../data/protocols/helperDb';
import { WinBeast } from '../../data/protocols/winBeast';

class PlayResultService implements PlayResult {
  constructor(private readonly helperDb: HelperDb, private readonly winBeast: WinBeast) {}

  async play() {
    const beasts = await this.helperDb.getAllBeast();

    if (beasts.length === 0) {
      console.log('vai ser um erro');

      return;
    }

    const index = Math.floor(Math.random() * beasts.length);
    const item = beasts[index - 1];

    await this.winBeast.addWin(item.id);
  }
}

export default PlayResultService;
