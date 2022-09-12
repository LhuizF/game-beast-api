import { CreateGame } from '../../domain/usecases/create-game';
import { GameModel } from '../../domain/models';
import { GameTime } from '../../presentation/protocols/game-time';
import { SaveGameRepository } from '../protocols/saveGameRepository';

export class CrateGameDb implements CreateGame {
  constructor(
    private readonly gameTime: GameTime,
    private readonly saveGameRepository: SaveGameRepository
  ) {}
  async nextGame(): Promise<GameModel> {
    const gameTime = this.gameTime.get();

    const game = await this.saveGameRepository.save(gameTime);

    return game;
  }
}
