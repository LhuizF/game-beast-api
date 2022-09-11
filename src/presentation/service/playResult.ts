import { PlayResult } from '../protocols/play-result';
import { HelperDb } from '../../data/protocols/helperDb';
import { WinBeast } from '../../data/protocols/winBeast';
import { GameTime } from '../protocols/game-time';

class PlayResultService implements PlayResult {
  constructor(
    private readonly helperDb: HelperDb,
    private readonly winBeast: WinBeast,
    private readonly gameTime: GameTime
  ) {}

  async play() {
    const beasts = await this.helperDb.getAllBeast();

    if (beasts.length === 0) {
      console.log('vai ser um erro');

      return;
    }

    const index = Math.floor(Math.random() * beasts.length);
    const beast = beasts[index - 1];

    const time = this.gameTime.get();

    console.log('beast', beast);
    console.log('index', index);
    console.log('time', time);

    await this.winBeast.addWin(1, time);
  }
}

export default PlayResultService;
