import { PlayBetModel, PlaceBet } from '../../domain/usecases/place-bet';
import { BetModel } from '../../domain/models/Bet';
import { Bet, SaveBetRepository } from '../protocols/saveBetRepository';
import { GameTime } from '../../presentation/protocols/game-time';
import { UpdatePoints } from '../protocols/updatePoints';

export class PlaceBetDb implements PlaceBet {
  constructor(
    private readonly saveBetRepository: SaveBetRepository,
    private readonly gameTime: GameTime,
    private readonly updatePoints: UpdatePoints
  ) {}
  async play(playBet: PlayBetModel): Promise<BetModel> {
    const { id_user, id_beast, points, platform } = playBet;

    const game_time = this.gameTime.get();

    const play: Bet = {
      id_user,
      id_beast,
      points,
      platform,
      game_time
    };

    const bet = await this.saveBetRepository.save(play);

    !!bet && (await this.updatePoints.discount(id_user, points));

    return bet;
  }
}
