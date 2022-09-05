import { HelperDb } from '../../../data/protocols/helperDb';
import { prisma } from './client';

export class PrismaHelper implements HelperDb {
  async verifyGuild(id: number) {
    await prisma.guild.findUniqueOrThrow({ where: { id } });
  }
}
