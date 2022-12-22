import { GuildModel } from '../../domain/models';
import { GameResult } from './play-result';

export interface SendMessage {
  send(data: GameResult, guilds: GuildModel[]): void;
}
