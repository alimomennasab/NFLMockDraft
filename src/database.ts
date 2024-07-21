import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getDraftOrder(): Promise<{ [key: number]: string }> {
  const draftOrderRecords = await prisma.draft_order.findMany();
  const draftOrder: { [key: number]: string } = {};
  draftOrderRecords.forEach(record => {
    if (record.pick_number !== null && record.team_name !== null) {
      draftOrder[record.pick_number] = record.team_name;
    }
  });
  return draftOrder;
}

export async function getProspects(): Promise<string[]> {
  const prospectsRecords = await prisma.prospects.findMany();
  return prospectsRecords
    .filter(record => record.name !== null)
    .map(record => record.name as string);
}

export async function getDraftCapital(): Promise<{ team_name: string, picks: number[] }[]> {
  const draftCapitalRecords = await prisma.draft_capital.findMany();
  return draftCapitalRecords.map(record => ({
    team_name: record.team_name,
    picks: record.picks,
  }));
}
