/*
  Warnings:

  - You are about to drop the column `game_time` on the `bets` table. All the data in the column will be lost.
  - Added the required column `id_game` to the `bets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bets" DROP COLUMN "game_time",
ADD COLUMN     "id_game" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "time" INTEGER NOT NULL,
    "result" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "games_id_key" ON "games"("id");

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_id_game_fkey" FOREIGN KEY ("id_game") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
