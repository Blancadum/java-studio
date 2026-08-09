export default function handler(req: any, res: any) {
  res.json({
    ok: true,
    env: {
      hasClientId: !!process.env.OAUTH_CLIENT_ID,
      hasClientSecret: !!process.env.OAUTH_CLIENT_SECRET,
      hasAppUrl: !!process.env.APP_URL,
      appUrl: process.env.APP_URL,
    }
  });
}
