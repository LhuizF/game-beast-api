-- CreateTable
CREATE TABLE "guild" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "channel" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guild_id_key" ON "guild"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_id_guild_fkey" FOREIGN KEY ("id_guild") REFERENCES "guild"("id") ON DELETE SET NULL ON UPDATE CASCADE;
