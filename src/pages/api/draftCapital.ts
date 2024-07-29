import type { NextApiRequest, NextApiResponse } from 'next';
import { getDraftCapitalData } from '../../mock';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const draftCapital = await getDraftCapitalData();
    res.status(200).json(draftCapital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch draft capital data' });
  }
}