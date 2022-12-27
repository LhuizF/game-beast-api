import { DisableGuild } from '../../../../data/protocols';
import { GuildModel } from '../../../../domain/models';
import { prisma } from './client';

export class DisableGuildPrisma implements DisableGuild {
  async disable(guildId: string): Promise<GuildModel | null> {
    const guild = await prisma.guild.findUnique({ where: { id: guildId } });

    if (!guild) return null;

    return await prisma.guild.update({
      where: { id: guildId },
      data: {
        active: false
      }
    });
  }
}
