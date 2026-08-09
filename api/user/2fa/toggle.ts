import type { VercelRequest, VercelResponse } from '@vercel/node';
import { toggleUser2FA } from '../../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, enabled } = req.body;
  try {
    const user = await toggleUser2FA(email, enabled);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
