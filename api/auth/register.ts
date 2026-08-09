import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerUser } from '../../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, name, password } = req.body;
  try {
    const user = await registerUser(email, name, password);
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
