import { AddGuild, AddGuildModel } from '../../domain/usecases/add-guild';
import { GuildModel } from '../../domain/models';
import { CreateGuildRepository } from '../protocols';

export class addGuildDbTest implements AddGuild {
  constructor(private readonly createGuildRepository: CreateGuildRepository) {}

  async add(guildDate: AddGuildModel): Promise<GuildModel> {
    const user = await this.createGuildRepository.save(guildDate);
    return user;
  }
}
