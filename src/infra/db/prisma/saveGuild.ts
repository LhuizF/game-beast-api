import { CreateGuildRepository } from '../../../data/protocols';
import { PrismaClient } from '@prisma/client';
import { GuildModel } from '../../../domain/models/guild';
import { AddGuildModel } from '../../../domain/usecases/add-guild';

export class CreateGuildPrismaRepository implements CreateGuildRepository {
  constructor(private readonly cxt: PrismaClient) {}

  async save(guildDate: AddGuildModel): Promise<GuildModel> {
    const guild = await this.cxt.guild.create({
      data: guildDate
    });

    return guild;
  }
}
