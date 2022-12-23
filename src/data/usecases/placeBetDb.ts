import { PlayBetModel, PlaceBet } from '../../domain/usecases/place-bet';
import { BetModel } from '../../domain/models';
import { Bet, SaveBetRepository } from '../protocols/saveBetRepository';
import { UpdatePoints } from '../protocols/updatePoints';

export class PlaceBetDb implements PlaceBet {
  constructor(
    private readonly saveBetRepository: SaveBetRepository,
    private readonly updatePoints: UpdatePoints
  ) {}
  async play(playBet: PlayBetModel): Promise<BetModel> {
    const { id_user, id_beast, points, platform, id_game } = playBet;

    const play: Bet = {
      id_user,
      id_beast,
      points,
      platform,
      id_game
    };

    const bet = await this.saveBetRepository.save(play);

    !!bet && (await this.updatePoints.discount(id_user, points));

    return bet;
  }
}
