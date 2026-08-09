import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveUserSession } from '../../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, session, sessionData } = req.body;
  const payload = session || sessionData;
  try {
    const saved = await saveUserSession(email, payload);
    res.json({ success: true, session: saved });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
