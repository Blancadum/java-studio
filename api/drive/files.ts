import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getOAuth2Client } from '../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const folderId = (req.query.folderId as string) || 'root';
  const search = (req.query.search as string) || '';
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: auth.substring(7) });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    let q = `'${folderId}' in parents and trashed = false`;
    if (search) q += ` and name contains '${search.replace(/'/g, "\\'")}'`;
    const { data } = await drive.files.list({
      q,
      pageSize: 50,
      fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink)',
      orderBy: 'folder,name',
    });
    res.json({ files: data.files || [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
