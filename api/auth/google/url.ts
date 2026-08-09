import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { google } = await import('googleapis');
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Missing env vars',
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId, clientSecret,
      `${appUrl}/api/auth/google/callback`
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });

    return res.json({ authUrl: url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
