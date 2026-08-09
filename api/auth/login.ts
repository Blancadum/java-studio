import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginUser } from '../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
