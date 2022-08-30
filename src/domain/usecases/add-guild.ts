import { GuildModel } from '../models/guild';

export interface AddGuildModel {
  id: number;
  name: string;
  icon: string;
  channel: number;
}

export interface AddGuild {
  add(guild: AddGuildModel): Promise<GuildModel>;
}
