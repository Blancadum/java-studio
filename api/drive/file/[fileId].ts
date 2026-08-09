import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getOAuth2Client } from '../../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const fileId = req.query.fileId as string;
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: auth.substring(7) });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const meta = await drive.files.get({ fileId, fields: 'id,name,mimeType' });
    const isText =
      meta.data.mimeType?.includes('text') ||
      meta.data.mimeType?.includes('json') ||
      meta.data.name?.endsWith('.java') ||
      meta.data.name?.endsWith('.md') ||
      meta.data.name?.endsWith('.txt');
    let content = '';
    if (isText) {
      const media = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' });
      content = media.data as string;
    } else {
      content = `[Archivo no de texto: ${meta.data.name}]`;
    }
    res.json({ id: meta.data.id, name: meta.data.name, mimeType: meta.data.mimeType, content });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
