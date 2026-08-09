import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateUserApiConfig } from '../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, config } = req.body;
  try {
    const user = await updateUserApiConfig(email, config);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
