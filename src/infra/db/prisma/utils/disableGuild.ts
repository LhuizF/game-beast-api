import { DisableGuild } from '../../../../data/protocols';
import { GuildModel } from '../../../../domain/models';
import { prisma } from './client';

export class DisableGuildPrisma implements DisableGuild {
  async disable(guildId: string): Promise<GuildModel> {
    return await prisma.guild.update({
      where: { id: guildId },
      data: {
        active: false
      }
    });
  }
}
