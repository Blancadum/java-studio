import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerUser, loginUser } from '../_lib/kv';
import { google } from 'googleapis';
import { getOAuth2Client } from '../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);

  // POST /api/auth/register
  if (req.method === 'POST' && pathname.endsWith('/register')) {
    const { email, name, password } = req.body;
    try {
      const user = await registerUser(email, name, password);
      return res.json({ success: true, user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // POST /api/auth/login
  if (req.method === 'POST' && pathname.endsWith('/login')) {
    const { email, password } = req.body;
    try {
      const user = await loginUser(email, password);
      return res.json({ success: true, user });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  // GET /api/auth/user
  if (req.method === 'GET' && pathname.endsWith('/user')) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    try {
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: auth.substring(7) });
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data } = await oauth2.userinfo.get();
      return res.json({ email: data.email, name: data.name, picture: data.picture });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  }

  return res.status(404).json({ error: 'Not found' });
}
