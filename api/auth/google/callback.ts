import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOAuth2Client } from '../_lib/oauth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const code = req.query.code as string;
  if (!code) return res.status(400).send('No authorization code');
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return res.send(`<!DOCTYPE html>
<html>
  <head><title>Autenticación exitosa</title></head>
  <body style="font-family:sans-serif;text-align:center;padding:40px;background:#f8fafc;">
    <h2>¡Conexión con Google Drive exitosa!</h2>
    <p>Cerrando esta ventana...</p>
    <script>
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '${appUrl}');
        window.close();
      } else {
        window.location.href = '/?driveConnected=true';
      }
    </script>
  </body>
</html>`);
  } catch (err: any) {
    return res.status(500).send(`Error: ${err.message}`);
  }
}
