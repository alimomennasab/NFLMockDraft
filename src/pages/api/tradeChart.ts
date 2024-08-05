import { NextApiRequest, NextApiResponse } from 'next';
import { getTradeChart } from '../../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tradeChart = await getTradeChart();
    res.status(200).json(tradeChart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade chart data' });
  }
}
