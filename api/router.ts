import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { GoogleGenAI } from '@google/genai';
import { getJavaProjectAnalysisPrompt, javaProjectAnalysisSchema } from './prompts/javaProjectAnalysisPrompt';
import { getNoobArchitecturePrompt, noobArchitectureSchema } from './prompts/noobArchitecturePrompt';
import { getPreSubmissionAuditPrompt, preSubmissionAuditSchema } from './prompts/preSubmissionAuditPrompt';
import { getSonarQualityPrompt, sonarQualitySchema } from './prompts/sonarQualityPrompt';
import { getJavaTutorChatPrompt } from './prompts/javaTutorChatPrompt';
import { getGenerateImprovedFilePrompt } from './prompts/generateImprovedFilePrompt';
import { UserProfile, SavedSession, UserApiConfig } from '../src/data/types';

type AiProvider = 'app_default' | 'user_gemini' | 'backup_fallback';

interface ApiOptions {
  preferredProvider?: AiProvider;
  geminiUserKey?: string;
  backupUserKey?: string;
  fallbackEnabled?: boolean;
}

async function executeWithAiFallback<T>(
  apiOptions: ApiOptions,
  fn: (ai: GoogleGenAI) => Promise<T>
): Promise<{ result: T; usedKeyType: string }> {
  const { preferredProvider = 'app_default', geminiUserKey, fallbackEnabled = true } = apiOptions;

  const getGenAIClient = (key?: string) => {
    if (!key) throw new Error('No API key provided for GenAI client');
    return new GoogleGenAI({ apiKey: key });
  };

  const appDefaultKey = process.env.GEMINI_API_KEY;

  // Try preferred provider first
  if (preferredProvider === 'user_gemini' && geminiUserKey) {
    try {
      const ai = getGenAIClient(geminiUserKey);
      const result = await fn(ai);
      return { result, usedKeyType: 'user_gemini' };
    } catch (err: any) {
      console.warn(`User's Gemini key failed: ${err.message}. Trying fallback...`);
      if (!fallbackEnabled) throw err;
    }
  }

  // Try app default key
  if (appDefaultKey) {
    try {
      const ai = getGenAIClient(appDefaultKey);
      const result = await fn(ai);
      return { result, usedKeyType: 'app_default' };
    } catch (err: any) {
      console.error(`App's default Gemini key failed: ${err.message}.`);
      throw err;
    }
  }

  throw new Error('No valid AI provider keys are configured or available.');
}


export interface DbModule {
  registerUser(email: string, name: string, password: string): Promise<UserProfile>;
  loginUser(email: string, password: string): Promise<UserProfile>;
  getUserProfile(email: string): Promise<UserProfile>;
  updateUserApiConfig(email: string, config: Partial<UserApiConfig>): Promise<UserProfile>;
  saveUserSession(email: string, sessionData: Omit<SavedSession, 'id' | 'createdAt'>): Promise<SavedSession>;
  toggleUser2FA(email: string, enabled: boolean): Promise<UserProfile>;
}

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
  };
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
      process.exit(1);
    }
    console.warn('Warning: JWT_SECRET is not set. Using a default for development.');
    return 'default_secret_for_development_only';
  }
  return secret;
}

function getOAuth2Client() {
    const clientId = process.env.OAUTH_CLIENT_ID;
    const clientSecret = process.env.OAUTH_CLIENT_SECRET;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/auth/google/callback`;
  
    if (!clientId || !clientSecret) {
      throw new Error('No se han configurado las credenciales de Google OAuth (OAUTH_CLIENT_ID u OAUTH_CLIENT_SECRET). Revisa la configuración de entorno.');
    }
  
    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

function getAppUrl() {
    return process.env.APP_URL || 'http://localhost:3000';
}


export function createApiRouter(db: DbModule) {
  const router = express.Router();
  const JWT_SECRET = getJwtSecret();

  const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
      req.user = { email: decoded.email };
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token inválido o expirado.' });
    }
  };

  // 1. HEALTH & AUTH
  router.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasOAuthClient: !!process.env.OAUTH_CLIENT_ID,
      appUrl: getAppUrl()
    });
  });

  router.post('/auth/register', async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const user = await db.registerUser(email, name, password);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.loginUser(email, password);
      const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ success: true, user, token });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  });

  // 2. USER PROFILE (Authenticated)
  router.get('/user/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'No autenticado.' });
    try {
      const user = await db.getUserProfile(email);
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/user/api-config', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { config } = req.body;
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'No autenticado.' });
    try {
      const updatedUser = await db.updateUserApiConfig(email, config);
      res.json({ success: true, user: updatedUser });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/user/2fa/toggle', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { enabled } = req.body;
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'No autenticado.' });
    try {
      const updatedUser = await db.toggleUser2FA(email, enabled);
      res.json({ success: true, user: updatedUser });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/user/sessions/save', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { sessionData } = req.body;
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: 'No autenticado.' });
    try {
      const savedSession = await db.saveUserSession(email, sessionData);
      const updatedUser = await db.getUserProfile(email);
      res.json({ success: true, session: savedSession, user: updatedUser });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // 3. OAUTH & DRIVE
  router.get('/auth/google/url', (req, res) => {
    try {
      const oauth2Client = getOAuth2Client();
      const scopes = [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ];
      const url = oauth2Client.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: scopes });
      res.json({ authUrl: url });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to generate OAuth URL' });
    }
  });

  router.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code as string;
    const appUrl = getAppUrl();
    if (!code) return res.status(400).send('No authorization code provided');
    try {
      const oauth2Client = getOAuth2Client();
      const { tokens } = await oauth2Client.getToken(code);
      res.send(`<!DOCTYPE html><html><head><title>Autenticación Exitosa</title></head><body style="font-family: sans-serif; text-align: center; padding: 40px; background: #f8fafc;"><h2>¡Conexión con Google Drive Exitosa!</h2><p>Cerrando esta ventana...</p><script>if (window.opener) { window.opener.postMessage({ type: 'OAUTH_SUCCESS', tokens: ${JSON.stringify(tokens)} }, '${appUrl}'); window.close(); } else { window.location.href = '/?driveConnected=true'; }</script></body></html>`);
    } catch (err: any) {
      console.error('Error exchanging OAuth code:', err);
      res.status(500).send(`Error de Autenticación: ${err.message}`);
    }
  });

  router.get('/auth/user', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.substring(7);
    try {
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: token });
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      res.json({ email: userInfo.data.email, name: userInfo.data.name, picture: userInfo.data.picture });
    } catch (err: any) {
      res.status(401).json({ error: 'Invalid token: ' + err.message });
    }
  });

  router.get('/drive/files', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
    const accessToken = authHeader.substring(7);
    const folderId = (req.query.folderId as string) || 'root';
    const search = (req.query.search as string) || '';
    try {
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      let query = `'${folderId}' in parents and trashed = false`;
      if (search) query += ` and name contains '${search.replace(/'/g, "\\'")}'`;
      const driveRes = await drive.files.list({ q: query, pageSize: 50, fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink)', orderBy: 'folder,name' });
      res.json({ files: driveRes.data.files || [] });
    } catch (err: any) {
      console.error('Error listing Drive files:', err);
      res.status(500).json({ error: err.message || 'Failed to list Drive files' });
    }
  });

  router.get('/drive/file/:fileId', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });
    const accessToken = authHeader.substring(7);
    const fileId = req.params.fileId;
    try {
      const oauth2Client = getOAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const meta = await drive.files.get({ fileId, fields: 'id, name, mimeType, size' });
      let content = '';
      if (meta.data.mimeType?.includes('text') || meta.data.mimeType?.includes('json') || meta.data.mimeType?.includes('javascript') || meta.data.mimeType?.includes('plain') || meta.data.name?.endsWith('.java') || meta.data.name?.endsWith('.md') || meta.data.name?.endsWith('.txt')) {
        const mediaRes = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' });
        content = mediaRes.data as string;
      } else {
        content = `[Archivo no de texto: ${meta.data.name} (${meta.data.mimeType})]`;
      }
      res.json({ id: meta.data.id, name: meta.data.name, mimeType: meta.data.mimeType, content });
    } catch (err: any) {
      console.error('Error downloading Drive file:', err);
      res.status(500).json({ error: err.message || 'Failed to fetch Drive file' });
    }
  });

  // 4. AI ANALYSIS
  router.post('/analyze/java-project', async (req, res) => {
    const { noFiles, fixedFiles, teacherDoc, apiOptions } = req.body;
    if (!noFiles || !fixedFiles) return res.status(400).json({ error: 'Faltan los archivos de JAVAII_NO o JAVAII-FIXED para analizar.' });
    try {
      const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getJavaProjectAnalysisPrompt(noFiles, fixedFiles, teacherDoc);
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json', responseSchema: javaProjectAnalysisSchema }
        });
        const resultText = response.text;
        if (!resultText) throw new Error('Gemini devolvió una respuesta vacía');
        return JSON.parse(resultText);
      });
      res.json({ ...result, metaUsedKey: usedKeyType });
    } catch (err: any) {
      console.error('Error in /api/analyze/java-project:', err);
      res.status(500).json({ error: err.message || 'Error en la evaluación de Gemini API' });
    }
  });

  router.post('/analyze/noob-architecture', async (req, res) => {
    const { assignmentText, statementText, targetLevel, apiOptions } = req.body;
    const text = assignmentText || statementText;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: 'Debes proporcionar un enunciado o especificación del ejercicio.' });
    }

    try {
      const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getNoobArchitecturePrompt(text, targetLevel);
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: noobArchitectureSchema,
          },
        });
        const resultText = response.text;
        if (!resultText) throw new Error('Respuesta vacía de Gemini');
        return JSON.parse(resultText);
      });
      res.json({ ...result, metaUsedKey: usedKeyType });
    } catch (err: any) {
      console.error('Error in /api/analyze/noob-architecture:', err);
      res.status(500).json({ error: err.message || 'Error generando guía de arquitectura' });
    }
  });

  router.post('/analyze/pre-submission-audit', async (req, res) => {
    const { files, rubricDoc, teacherRubricText, apiOptions } = req.body;
    const rubric = rubricDoc || teacherRubricText;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar al menos un archivo Java para la auditoría pre-entrega.' });
    }

    try {
      const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getPreSubmissionAuditPrompt(files, rubric);
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: preSubmissionAuditSchema,
          },
        });
        const text = response.text;
        if (!text) throw new Error('Respuesta vacía');
        return JSON.parse(text);
      });
      res.json({ ...result, metaUsedKey: usedKeyType });
    } catch (err: any) {
      console.error('Error in /api/analyze/pre-submission-audit:', err);
      res.status(500).json({ error: err.message || 'Error auditando entrega' });
    }
  });

  router.post('/analyze/sonar-quality', async (req, res) => {
    const { files, apiOptions } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar archivos Java para la inspección SonarQube.' });
    }

    try {
      const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getSonarQualityPrompt(files);
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: sonarQualitySchema,
          },
        });
        const text = response.text;
        if (!text) throw new Error('Respuesta vacía');
        return JSON.parse(text);
      });
      res.json({ ...result, metaUsedKey: usedKeyType });
    } catch (err: any) {
      console.error('Error in /api/analyze/sonar-quality:', err);
      res.status(500).json({ error: err.message || 'Error en análisis SonarQube' });
    }
  });

  router.post('/chat/tutor', async (req, res) => {
    const { message, context, apiOptions } = req.body;
    try {
      const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getJavaTutorChatPrompt(message, context);
        const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
        return response.text || 'Sin respuesta';
      });
      res.json({ text: result });
    } catch (err: any) {
      console.error('Error in /api/chat/tutor:', err);
      res.status(500).json({ error: err.message || 'Error en la respuesta del tutor IA' });
    }
  });

  router.post('/generate/improved-file', async (req, res) => {
    const { fileTarget, currentCode, proposalsToApply, teacherDoc, apiOptions } = req.body;
    try {
      const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
        const prompt = getGenerateImprovedFilePrompt(fileTarget, currentCode, proposalsToApply, teacherDoc);
        const response = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
        let cleanCode = response.text || '';
        cleanCode = cleanCode.replace(/^```java\n?/, '').replace(/\n?```$/, '').trim();
        return cleanCode;
      });
      res.json({ updatedCode: result });
    } catch (err: any) {
      console.error('Error generating improved file:', err);
      res.status(500).json({ error: err.message || 'Error al generar el archivo mejorado' });
    }
  });

  return router;
}