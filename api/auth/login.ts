import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginUser } from '../../lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
}
