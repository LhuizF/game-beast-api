import { HelperDb } from '../../../data/protocols/helperDb';
import { prisma } from './client';

export class PrismaHelper implements HelperDb {
  async verifyGuild(id: number) {
    await prisma.guild.findUniqueOrThrow({ where: { id } });
  }
  async verifyUser(id: string): Promise<void> {
    await prisma.user.findUniqueOrThrow({ where: { id } });
  }
  async verifyBeast(id: number): Promise<void> {
    await prisma.beast.findUniqueOrThrow({ where: { id } });
  }
}
