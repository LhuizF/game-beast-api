import { GuildModel } from '../../domain/models';
import { AddGuildModel } from '../../domain/usecases/add-guild';

export interface CreateGuildRepository {
  save(guildDate: AddGuildModel): Promise<GuildModel>;
}
