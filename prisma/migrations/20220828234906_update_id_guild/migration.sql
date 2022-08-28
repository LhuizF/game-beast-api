/*
  Warnings:

  - The `id_discord` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[id_discord]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_guild` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `avatar` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "id_guild",
ADD COLUMN     "id_guild" INTEGER NOT NULL,
DROP COLUMN "id_discord",
ADD COLUMN     "id_discord" INTEGER,
ALTER COLUMN "avatar" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_id_discord_key" ON "user"("id_discord");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
