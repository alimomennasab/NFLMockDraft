-- CreateTable
CREATE TABLE "trade_chart" (
    "id" SERIAL NOT NULL,
    "pick_number" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "trade_chart_pkey" PRIMARY KEY ("id")
);
