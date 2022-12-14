import { GuildModel } from '../models';

export interface AddGuildModel {
  id: string;
  name: string;
  icon: string;
  channel: string;
  role: string;
}

export interface AddGuild {
  add(guild: AddGuildModel): Promise<GuildModel>;
}
