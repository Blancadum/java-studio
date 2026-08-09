import type { VercelRequest, VercelResponse } from '@vercel/node';
import { updateUserApiConfig, saveUserSession, toggleUser2FA } from '../_lib/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);

  if (pathname.includes('api-config')) {
    const { email, config } = req.body;
    try {
      const user = await updateUserApiConfig(email, config);
      return res.json({ success: true, user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (pathname.includes('sessions')) {
    const { email, session, sessionData } = req.body;
    const payload = session || sessionData;
    try {
      const saved = await saveUserSession(email, payload);
      return res.json({ success: true, session: saved });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (pathname.includes('2fa')) {
    const { email, enabled } = req.body;
    try {
      const user = await toggleUser2FA(email, enabled);
      return res.json({ success: true, user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
