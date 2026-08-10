import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { google } from 'googleapis';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json({ limit: '50mb' }));

// ── Helpers ───────────────────────────────────────────────────────────────────

function getOAuth2Client() {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  if (!clientId || !clientSecret) throw new Error('Faltan OAUTH_CLIENT_ID u OAUTH_CLIENT_SECRET.');
  return new google.auth.OAuth2(clientId, clientSecret, `${appUrl}/api/auth/google/callback`);
}

async function runAI(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const res = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
  return res.text || '';
}

async function runAIJson(prompt: string, schema: any): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const res = await ai.models.generateContent({
    model: 'gemini-2.0-flash', contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema }
  });
  return JSON.parse(res.text!);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY }));

app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, user: { id: `usr_${Date.now()}`, name: req.body.name, email: req.body.email, sessions: [], totalTokensSaved: 0, apiConfig: { preferredProvider: 'app_default', activeModelName: 'gemini-2.0-flash', maskedGeminiKey: '', maskedBackupKey: '', fallbackEnabled: true }, twoFactorAuth: { enabled: false } } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'blanca@estudiante.edu' && password === 'java2026') {
    return res.json({ success: true, user: { id: 'usr_blanca_1', name: 'Blanca Dumont', email, sessions: [], totalTokensSaved: 124500, apiConfig: { preferredProvider: 'app_default', activeModelName: 'gemini-2.0-flash', maskedGeminiKey: '', maskedBackupKey: '', fallbackEnabled: true }, twoFactorAuth: { enabled: false } } });
  }
  res.status(401).json({ error: 'Credenciales incorrectas.' });
});

app.get('/api/auth/google/url', (req, res) => {
  try {
    const url = getOAuth2Client().generateAuthUrl({
      access_type: 'offline', prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });
    res.json({ authUrl: url });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send('No code');
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  try {
    const { tokens } = await getOAuth2Client().getToken(code);
    res.send(`<!DOCTYPE html><html><head><title>Auth OK</title></head><body><script>if(window.opener){window.opener.postMessage({type:'OAUTH_SUCCESS',tokens:${JSON.stringify(tokens)}},'${appUrl}');window.close();}else{window.location.href='/?driveConnected=true';}</script></body></html>`);
  } catch (err: any) { res.status(500).send(err.message); }
});

app.get('/api/auth/user', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    const client = getOAuth2Client();
    client.setCredentials({ access_token: auth.substring(7) });
    const { data } = await google.oauth2({ version: 'v2', auth: client }).userinfo.get();
    res.json({ email: data.email, name: data.name, picture: data.picture });
  } catch (err: any) { res.status(401).json({ error: err.message }); }
});

// ── User ──────────────────────────────────────────────────────────────────────

app.get('/api/user/profile', (req, res) => res.json({ id: 'usr_blanca_1', name: 'Blanca Dumont', email: 'blanca@estudiante.edu', sessions: [], totalTokensSaved: 124500, apiConfig: { preferredProvider: 'app_default', activeModelName: 'gemini-2.0-flash', maskedGeminiKey: '', maskedBackupKey: '', fallbackEnabled: true }, twoFactorAuth: { enabled: false } }));
app.post('/api/user/api-config', (req, res) => res.json({ success: true }));
app.post('/api/user/2fa/toggle', (req, res) => res.json({ success: true }));
app.post('/api/user/sessions/save', (req, res) => res.json({ success: true, session: { ...req.body.sessionData, id: `sess_${Date.now()}`, createdAt: new Date().toISOString() } }));

// ── Drive ─────────────────────────────────────────────────────────────────────

app.get('/api/drive/files', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const folderId = (req.query.folderId as string) || 'root';
  const search = (req.query.search as string) || '';
  try {
    const client = getOAuth2Client();
    client.setCredentials({ access_token: auth.substring(7) });
    const drive = google.drive({ version: 'v3', auth: client });
    let q = `'${folderId}' in parents and trashed = false`;
    if (search) q += ` and name contains '${search.replace(/'/g, "\\'")}'`;
    const { data } = await drive.files.list({ q, pageSize: 50, fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,iconLink)', orderBy: 'folder,name' });
    res.json({ files: data.files || [] });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.get('/api/drive/file/:fileId', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  const { fileId } = req.params;
  try {
    const client = getOAuth2Client();
    client.setCredentials({ access_token: auth.substring(7) });
    const drive = google.drive({ version: 'v3', auth: client });
    const meta = await drive.files.get({ fileId, fields: 'id,name,mimeType' });
    const isText = meta.data.mimeType?.includes('text') || meta.data.name?.endsWith('.java') || meta.data.name?.endsWith('.md') || meta.data.name?.endsWith('.txt');
    let content = '';
    if (isText) {
      const media = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' });
      content = media.data as string;
    } else content = `[Archivo no de texto: ${meta.data.name}]`;
    res.json({ id: meta.data.id, name: meta.data.name, mimeType: meta.data.mimeType, content });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Analyze ───────────────────────────────────────────────────────────────────

app.post('/api/analyze/java-project', async (req, res) => {
  const { noFiles, fixedFiles, teacherDoc } = req.body;
  if (!noFiles || !fixedFiles) return res.status(400).json({ error: 'Faltan archivos.' });
  try {
    const result = await runAIJson(`Eres un profesor senior experto en Java II. Analiza JAVAII_NO vs JAVAII-FIXED.
INDICACIONES PROFESORA: ${teacherDoc || 'Extrae requerimientos implícitos de Java II.'}
ARCHIVOS SUSPENDIDOS: ${JSON.stringify(noFiles)}
ARCHIVOS REVISADOS: ${JSON.stringify(fixedFiles)}
Responde ÚNICAMENTE en JSON en español.`, {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER }, passLikelihood: { type: Type.STRING, enum: ['ALTA','MEDIA','BAJA','REQUIERE_CAMBIOS'] },
        teacherComplianceScore: { type: Type.INTEGER }, summary: { type: Type.STRING },
        keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, category: { type: Type.STRING }, description: { type: Type.STRING }, priority: { type: Type.STRING }, status: { type: Type.STRING }, teacherNote: { type: Type.STRING }, location: { type: Type.STRING } }, required: ['id','title','category','description','priority','status'] } },
        proposals: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, fileTarget: { type: Type.STRING }, issueTitle: { type: Type.STRING }, category: { type: Type.STRING }, description: { type: Type.STRING }, originalCode: { type: Type.STRING }, proposedCode: { type: Type.STRING }, explanation: { type: Type.STRING }, fulfillsTeacherPoint: { type: Type.STRING }, impact: { type: Type.STRING } }, required: ['id','fileTarget','issueTitle','category','description','originalCode','proposedCode','explanation','impact'] } },
        generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['overallScore','passLikelihood','teacherComplianceScore','summary','keyStrengths','criticalGaps','recommendations','proposals','generalAdvice']
    });
    res.json(result);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/analyze/noob-architecture', async (req, res) => {
  const { assignmentText, statementText, targetLevel } = req.body;
  const text = assignmentText || statementText;
  if (!text?.trim()) return res.status(400).json({ error: 'Debes proporcionar el enunciado.' });
  try {
    const result = await runAIJson(`Eres un tutor de Java POO para nivel ${targetLevel || 'Principiante'}.
ENUNCIADO: "${text}"
Crea guía de arquitectura sin resolver el código. Responde ÚNICAMENTE en JSON en español.`, {
      type: Type.OBJECT,
      properties: {
        projectName: { type: Type.STRING }, summary: { type: Type.STRING }, architectureType: { type: Type.STRING },
        recommendedClasses: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { className: { type: Type.STRING }, packagePath: { type: Type.STRING }, type: { type: Type.STRING }, purpose: { type: Type.STRING }, keyMethods: { type: Type.ARRAY, items: { type: Type.STRING } }, suggestedAttributes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['className','packagePath','type','purpose','keyMethods','suggestedAttributes'] } },
        roadmapSteps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stepNumber: { type: Type.INTEGER }, title: { type: Type.STRING }, description: { type: Type.STRING }, targetClass: { type: Type.STRING }, tips: { type: Type.STRING } }, required: ['stepNumber','title','description','targetClass','tips'] } },
        conceptChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['projectName','summary','architectureType','recommendedClasses','roadmapSteps','conceptChecklist']
    });
    res.json(result);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/analyze/pre-submission-audit', async (req, res) => {
  const { files, rubricDoc, teacherRubricText } = req.body;
  if (!files?.length) return res.status(400).json({ error: 'Debes proporcionar archivos Java.' });
  try {
    const result = await runAIJson(`Eres un auditor de entregas académicas Java. Detecta rastros de IA y artefactos.
ARCHIVOS: ${JSON.stringify(files)}
RÚBRICA: ${rubricDoc || teacherRubricText || 'Estándar: código compilable, sin artefactos.'}
Responde ÚNICAMENTE en JSON en español.`, {
      type: Type.OBJECT,
      properties: {
        cleanScore: { type: Type.INTEGER }, readyToSubmit: { type: Type.BOOLEAN }, summary: { type: Type.STRING },
        detectedIssues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, severity: { type: Type.STRING }, title: { type: Type.STRING }, location: { type: Type.STRING }, snippet: { type: Type.STRING }, suggestedFix: { type: Type.STRING } }, required: ['id','type','severity','title','location','suggestedFix'] } },
        rubricChecks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, passed: { type: Type.BOOLEAN }, note: { type: Type.STRING } }, required: ['item','passed','note'] } }
      },
      required: ['cleanScore','readyToSubmit','summary','detectedIssues','rubricChecks']
    });
    res.json(result);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/analyze/sonar-quality', async (req, res) => {
  const { files } = req.body;
  if (!files?.length) return res.status(400).json({ error: 'Debes proporcionar archivos Java.' });
  try {
    const result = await runAIJson(`Eres un ingeniero de calidad SonarQube y SOLID para Java.
ARCHIVOS: ${JSON.stringify(files)}
Responde ÚNICAMENTE en JSON en español.`, {
      type: Type.OBJECT,
      properties: {
        qualityGate: { type: Type.STRING, enum: ['PASSED','FAILED','WARNING'] },
        codeSmellsCount: { type: Type.INTEGER }, cyclomaticComplexityRating: { type: Type.STRING, enum: ['A','B','C','D','F'] },
        solidComplianceScore: { type: Type.INTEGER },
        issues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { ruleId: { type: Type.STRING }, ruleName: { type: Type.STRING }, severity: { type: Type.STRING }, fileTarget: { type: Type.STRING }, lineNumber: { type: Type.INTEGER }, description: { type: Type.STRING }, refactoringHint: { type: Type.STRING } }, required: ['ruleId','ruleName','severity','fileTarget','description','refactoringHint'] } },
        junitRecommendations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { targetClass: { type: Type.STRING }, suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['targetClass','suggestedTests'] } }
      },
      required: ['qualityGate','codeSmellsCount','cyclomaticComplexityRating','solidComplianceScore','issues','junitRecommendations']
    });
    res.json(result);
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Chat & Generate ───────────────────────────────────────────────────────────

app.post('/api/chat/tutor', async (req, res) => {
  const { message, context } = req.body;
  try {
    const text = await runAI(`Eres un tutor universitario experto en Java II. Responde en español de forma didáctica.
Contexto: ${JSON.stringify(context || {})}
Pregunta: ${message}`);
    res.json({ text });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

app.post('/api/generate/improved-file', async (req, res) => {
  const { fileTarget, currentCode, proposalsToApply, teacherDoc } = req.body;
  try {
    let code = await runAI(`Aplica estas propuestas al archivo Java "${fileTarget}".
CÓDIGO ACTUAL:\n\`\`\`java\n${currentCode}\n\`\`\`
PROPUESTAS: ${JSON.stringify(proposalsToApply)}
INDICACIONES PROFESORA: ${teacherDoc}
Devuelve SOLO el código Java final limpio sin bloques markdown.`);
    code = code.replace(/^```java\n?/, '').replace(/\n?```$/, '').trim();
    res.json({ updatedCode: code });
  } catch (err: any) { res.status(500).json({ error: err.message }); }
});

// ── Export para Vercel ────────────────────────────────────────────────────────
export default app;
