import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getOAuth2Client } from '../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ access_token: auth.substring(7) });
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  const fileIdMatch = pathname.match(/\/file\/([^/]+)$/);

  // GET /api/drive/file/:fileId
  if (req.method === 'GET' && fileIdMatch) {
    const fileId = fileIdMatch[1];
    try {
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
      return res.json({ id: meta.data.id, name: meta.data.name, mimeType: meta.data.mimeType, content });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // GET /api/drive/files
  if (req.method === 'GET') {
    const folderId = (req.query.folderId as string) || 'root';
    const search = (req.query.search as string) || '';
    try {
      let q = `'${folderId}' in parents and trashed = false`;
      if (search) q += ` and name contains '${search.replace(/'/g, "\\'")}'`;
      const { data } = await drive.files.list({
        q,
        pageSize: 50,
        fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink)',
        orderBy: 'folder,name',
      });
      return res.json({ files: data.files || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).end();
}
