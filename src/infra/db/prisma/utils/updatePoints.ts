import { UpdatePoints } from '../../../../data/protocols/updatePoints';
import { prisma } from './client';

export class UpdatePointsPrisma implements UpdatePoints {
  async discount(userID: string, points: number): Promise<void> {
    await prisma.user.update({
      where: { id: userID },
      data: { points: { decrement: points } }
    });
  }
}
