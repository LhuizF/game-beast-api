-- CreateTable
CREATE TABLE "log_erro" (
    "id" SERIAL NOT NULL,
    "stack" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_erro_pkey" PRIMARY KEY ("id")
);
