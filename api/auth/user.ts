import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getOAuth2Client } from '../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: auth.substring(7) });
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    res.json({ email: data.email, name: data.name, picture: data.picture });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
}
