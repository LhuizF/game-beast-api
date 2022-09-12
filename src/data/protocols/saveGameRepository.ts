import { GameModel } from '../../domain/models';

export interface SaveGameRepository {
  save(time: number): Promise<GameModel>;
}
