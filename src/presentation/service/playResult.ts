import { Result, PlayResult } from '../protocols/play-result';
import { HelperDb } from '../../data/protocols/helperDb';
import { WinBeast } from '../../data/protocols/winBeast';
import { BeastModel } from '../../domain/models';
import { CreateGame } from '../../domain/usecases/create-game';

class PlayResultService implements PlayResult {
  constructor(
    private readonly helperDb: HelperDb,
    private readonly winBeast: WinBeast,
    private readonly crateGame: CreateGame
  ) {}

  async play(): Promise<Result> {
    const beasts = await this.helperDb.getAllBeast();
    const game = await this.helperDb.getCurrentGameId();

    if (beasts.length === 0) {
      console.log('vai ser um erro');
      return {
        isSuccess: false,
        data: {
          date: new Date(),
          body: {
            beasts,
            game
          }
        }
      };
    }

    const beast = this.beastSelected(beasts);

    const { totalBets, winners, losers } = await this.winBeast.addWin(game, beast.id);

    await this.crateGame.nextGame();

    return {
      isSuccess: true,
      data: {
        id_game: game,
        beastWin: beast,
        totalBets,
        winners,
        losers
      }
    };
  }

  beastSelected(beasts: BeastModel[]): BeastModel {
    const index = Math.floor(Math.random() * beasts.length);
    return beasts[index];
  }
}

export default PlayResultService;
