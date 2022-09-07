/*
  Warnings:

  - You are about to drop the `guild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `log_erro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_id_guild_fkey";

-- DropTable
DROP TABLE "guild";

-- DropTable
DROP TABLE "log_erro";

-- DropTable
DROP TABLE "user";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 100,
    "id_guild" INTEGER,
    "id_discord" INTEGER,
    "email" TEXT,
    "password" TEXT,
    "avatar" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "channel" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bets" (
    "id" SERIAL NOT NULL,
    "points" INTEGER NOT NULL,
    "game_time" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "platform" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_beast" INTEGER NOT NULL,

    CONSTRAINT "bets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beasts" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "times_win" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "beasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_errors" (
    "id" SERIAL NOT NULL,
    "stack" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_errors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_id_key" ON "guilds"("id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_guild_fkey" FOREIGN KEY ("id_guild") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bets" ADD CONSTRAINT "bets_id_beast_fkey" FOREIGN KEY ("id_beast") REFERENCES "beasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
