import { PlayBetModel, PlaceBet } from '../../domain/usecases/place-bet';
import { Bet } from '../../domain/models/Bet';
import { HelperDb } from '../protocols/helperDb';
import { BetModel, SaveBetRepository } from '../protocols/saveBetRepository';
import { GameTime } from '../../presentation/protocols/game-time';
import { UpdatePoints } from '../protocols/updatePoints';

export class PlaceBetDb implements PlaceBet {
  constructor(
    private readonly saveBetRepository: SaveBetRepository,
    private readonly helperDb: HelperDb,
    private readonly gameTime: GameTime,
    private readonly updatePoints: UpdatePoints
  ) {}
  async play(playBet: PlayBetModel): Promise<Bet> {
    const { id_user, id_beast, points, platform } = playBet;

    await this.helperDb.verifyUser(id_user);
    await this.helperDb.verifyBeast(id_beast);

    const game_time = this.gameTime.get();

    const play: BetModel = {
      id_user,
      id_beast,
      points,
      platform,
      game_time
    };

    const bet = await this.saveBetRepository.save(play);

    await this.updatePoints.discount(id_user, points);

    return bet;
  }
}
