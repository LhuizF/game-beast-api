import { GuildModel } from '../../domain/models';

export interface DisableGuild {
  disable(guildId: string): Promise<GuildModel>;
}
