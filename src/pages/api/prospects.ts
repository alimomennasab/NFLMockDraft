import type { NextApiRequest, NextApiResponse } from 'next';
import { getProspects } from '../../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const draftCapital = await getProspects();
    res.status(200).json(draftCapital);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch draft capital data' });
  }
}