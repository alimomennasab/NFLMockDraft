-- CreateTable
CREATE TABLE "draft_order" (
    "id" SERIAL NOT NULL,
    "team_name" VARCHAR(50),
    "pick_number" INTEGER,

    CONSTRAINT "draft_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospects" (
    "id" SERIAL NOT NULL,
    "position" VARCHAR(10),
    "ranking" INTEGER,
    "name" VARCHAR(100),

    CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_capital" (
    "id" SERIAL NOT NULL,
    "team_name" VARCHAR(50),
    "picks" INTEGER[],

    CONSTRAINT "draft_capital_pkey" PRIMARY KEY ("id")
);