import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import { Type } from '@google/genai';
import { executeWithAiFallback, getGenAIClient } from './server/aiService';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserApiConfig,
  saveUserSession,
  toggleUser2FA
} from './server/userStore';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to get OAuth2 client
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

// Get APP_URL with fallback
function getAppUrl() {
  return process.env.APP_URL || 'http://localhost:3000';
}

// ----------------------------------------------------
// 1. HEALTH CHECK & AUTH USER ENDPOINTS
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasOAuthClient: !!process.env.OAUTH_CLIENT_ID,
    appUrl: getAppUrl()
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body;
  try {
    const user = registerUser(email, name, password);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = loginUser(email, password);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/user/profile', (req, res) => {
  const email = (req.query.email as string) || 'blanca@estudiante.edu';
  try {
    const user = getUserProfile(email);
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/api-config', (req, res) => {
  const { email, config } = req.body;
  try {
    const updatedUser = updateUserApiConfig(email || 'blanca@estudiante.edu', config);
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/user/2fa/toggle', (req, res) => {
  const { email, enabled } = req.body;
  try {
    const updatedUser = toggleUser2FA(email || 'blanca@estudiante.edu', enabled);
    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/user/sessions/save', (req, res) => {
  const { email, session, sessionData } = req.body;
  const sessionPayload = session || sessionData;
  try {
    const saved = saveUserSession(email || 'blanca@estudiante.edu', sessionPayload);
    res.json({ success: true, session: saved });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 2. OAUTH ROUTES (Google Workspace / Google Drive)
// ----------------------------------------------------
app.get('/api/auth/google/url', (req, res) => {
  try {
    const oauth2Client = getOAuth2Client();
    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes
    });

    res.json({ authUrl: url });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to generate OAuth URL' });
  }
});

app.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code as string;
  const appUrl = getAppUrl();
  
  if (!code) {
    return res.status(400).send('No authorization code provided');
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    // Return HTML that posts tokens to opener window and closes popup
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Autenticación Exitosa</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #f8fafc;">
          <h2>¡Conexión con Google Drive Exitosa!</h2>
          <p>Cerrando esta ventana de autorización...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({
                type: 'OAUTH_SUCCESS',
                tokens: ${JSON.stringify(tokens)}
              }, '${appUrl}');
              window.close();
            } else {
              window.location.href = '/?driveConnected=true';
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error('Error exchanging OAuth code:', err);
    res.status(500).send(`Error de Autenticación: ${err.message}`);
  }
});

app.get('/api/auth/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: token });

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    res.json({
      email: userInfo.data.email,
      name: userInfo.data.name,
      picture: userInfo.data.picture
    });
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid token: ' + err.message });
  }
});

// ----------------------------------------------------
// 3. GOOGLE DRIVE API ENDPOINTS
// ----------------------------------------------------
app.get('/api/drive/files', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const accessToken = authHeader.substring(7);
  const folderId = (req.query.folderId as string) || 'root';
  const search = (req.query.search as string) || '';

  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    let query = `'${folderId}' in parents and trashed = false`;
    if (search) {
      query += ` and name contains '${search.replace(/'/g, "\\'")}'`;
    }

    const driveRes = await drive.files.list({
      q: query,
      pageSize: 50,
      fields: 'files(id, name, mimeType, modifiedTime, size, webViewLink, iconLink)',
      orderBy: 'folder,name'
    });

    res.json({ files: driveRes.data.files || [] });
  } catch (err: any) {
    console.error('Error listing Drive files:', err);
    res.status(500).json({ error: err.message || 'Failed to list Drive files' });
  }
});

app.get('/api/drive/file/:fileId', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const accessToken = authHeader.substring(7);
  const fileId = req.params.fileId;

  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // Get metadata
    const meta = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size'
    });

    let content = '';
    // If text/code file, download alt=media
    if (
      meta.data.mimeType?.includes('text') ||
      meta.data.mimeType?.includes('json') ||
      meta.data.mimeType?.includes('javascript') ||
      meta.data.mimeType?.includes('plain') ||
      meta.data.name?.endsWith('.java') ||
      meta.data.name?.endsWith('.md') ||
      meta.data.name?.endsWith('.txt')
    ) {
      const mediaRes = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'text' }
      );
      content = mediaRes.data as string;
    } else {
      content = `[Archivo no de texto: ${meta.data.name} (${meta.data.mimeType})]`;
    }

    res.json({
      id: meta.data.id,
      name: meta.data.name,
      mimeType: meta.data.mimeType,
      content
    });
  } catch (err: any) {
    console.error('Error downloading Drive file:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch Drive file' });
  }
});

// ----------------------------------------------------
// 4. AI GEMINI ANALYSIS ENDPOINTS (MULTI-PERSONA & FALLBACK)
// ----------------------------------------------------

// Persona 1: Subsanación de Feedback Post-Suspenso
app.post('/api/analyze/java-project', async (req, res) => {
  const { noFiles, fixedFiles, teacherDoc, apiOptions } = req.body;

  if (!noFiles || !fixedFiles) {
    return res.status(400).json({ error: 'Faltan los archivos de JAVAII_NO o JAVAII-FIXED para analizar.' });
  }

  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const prompt = `
Eres un profesor senior experto en evaluación de proyectos de Java II y Programación Orientada a Objetos en la universidad.

Tu misión es analizar la revisión de un alumno que ha suspendido (carpeta JAVAII_NO) y ha presentado correcciones (JAVAII-FIXED), basándote también en el documento de recomendaciones o indicaciones de su profesora.

--- DOCUMENTO DE INDICACIONES / RECOMENDACIONES DE LA PROFESORA ---
${teacherDoc || 'No se proporcionó documento explícito. Extrae requerimientos implícitos de Java II (excepciones, genéricos, streams, JUnit, encapsulamiento, etc.)'}

--- ARCHIVOS ORIGINALES SUSPENDIDOS (JAVAII_NO) ---
${JSON.stringify(noFiles, null, 2)}

--- ARCHIVOS REVISADOS ACTUALES (JAVAII-FIXED) ---
${JSON.stringify(fixedFiles, null, 2)}

--- INSTRUCCIONES DE EVALUACIÓN ---
Analiza en profundidad:
1. Compara JAVAII_NO con JAVAII-FIXED.
2. Evalúa si la versión JAVAII-FIXED cumple al 100% las indicaciones de la profesora o si aún tiene faltas o errores.
3. Genera propuestas de mejora concretas (código Java real) para subsanar cualquier fallo restante y asegurar el APROBADO con máxima nota.

Proporciona la respuesta ÚNICAMENTE en el siguiente formato JSON estructurado en español:
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER, description: 'Puntuación estimada de 0 a 100' },
              passLikelihood: { type: Type.STRING, enum: ['ALTA', 'MEDIA', 'BAJA', 'REQUIERE_CAMBIOS'] },
              teacherComplianceScore: { type: Type.INTEGER, description: 'Porcentaje de cumplimiento de requisitos de la profesora (0-100)' },
              summary: { type: Type.STRING, description: 'Resumen ejecutivo claro en español' },
              keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              criticalGaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['OOP', 'EXCEPTIONS', 'COLLECTIONS', 'TESTS', 'DOCUMENTATION', 'ARCHITECTURE', 'OTHER'] },
                    description: { type: Type.STRING },
                    priority: { type: Type.STRING, enum: ['CRITICAL', 'RECOMMENDED', 'EXTRA'] },
                    status: { type: Type.STRING, enum: ['SATISFIED', 'PARTIAL', 'MISSING'] },
                    teacherNote: { type: Type.STRING },
                    location: { type: Type.STRING }
                  },
                  required: ['id', 'title', 'category', 'description', 'priority', 'status']
                }
              },
              proposals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    fileTarget: { type: Type.STRING },
                    issueTitle: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['OOP', 'EXCEPTIONS', 'COLLECTIONS', 'TESTS', 'DOCUMENTATION', 'ARCHITECTURE', 'OTHER'] },
                    description: { type: Type.STRING },
                    originalCode: { type: Type.STRING },
                    proposedCode: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    fulfillsTeacherPoint: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] }
                  },
                  required: ['id', 'fileTarget', 'issueTitle', 'category', 'description', 'originalCode', 'proposedCode', 'explanation', 'impact']
                }
              },
              generalAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['overallScore', 'passLikelihood', 'teacherComplianceScore', 'summary', 'keyStrengths', 'criticalGaps', 'recommendations', 'proposals', 'generalAdvice']
          }
        }
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

// Persona 2: Guía de Inicio & Arquitectura desde Enunciado (Nivel Principiante/Noob)
app.post('/api/analyze/noob-architecture', async (req, res) => {
  const { assignmentText, targetLevel, apiOptions } = req.body;

  if (!assignmentText || assignmentText.trim().length < 10) {
    return res.status(400).json({ error: 'Debes proporcionar un enunciado o especificación del ejercicio.' });
  }

  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const prompt = `
Eres un tutor de programación Java experto en desglosar enunciados complejos en arquitecturas sencillas, limpias y escalables para estudiantes de nivel ${targetLevel || 'Principiante/Intermedio'}.

ENUNCIADO / PRACTICA SUBIDA POR EL ALUMNO:
"${assignmentText}"

Analiza el enunciado y crea una guía completa de arquitectura Java orientada a objetos (POO) sin escribir todo el código terminado (para que el alumno aprenda y programe por sí mismo), estructurado así:
1. Nombre del proyecto sugerido.
2. Tipo de arquitectura recomendada (ej: Capas MVC, POO Tradicional, Servicios + Repositorio en memoria).
3. Clases, interfaces y excepciones recomendadas con su propósito, métodos clave y atributos sugeridos.
4. Pasos estructurados (Roadmap paso a paso) para empezar a programar sin agobiarse.
5. Lista de conceptos Java clave a revisar (ej: ArrayList, HashMap, Try-Catch, Override, implements Comparable).

Devuelve la respuesta ÚNICAMENTE como JSON válido en español.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectName: { type: Type.STRING },
              summary: { type: Type.STRING },
              architectureType: { type: Type.STRING },
              recommendedClasses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    className: { type: Type.STRING },
                    packagePath: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['class', 'interface', 'enum', 'exception'] },
                    purpose: { type: Type.STRING },
                    keyMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
                    suggestedAttributes: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['className', 'packagePath', 'type', 'purpose', 'keyMethods', 'suggestedAttributes']
                }
              },
              roadmapSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    targetClass: { type: Type.STRING },
                    tips: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'title', 'description', 'targetClass', 'tips']
                }
              },
              conceptChecklist: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['projectName', 'summary', 'architectureType', 'recommendedClasses', 'roadmapSteps', 'conceptChecklist']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error('Respuesta vacía de Gemini');
      return JSON.parse(text);
    });

    res.json({ ...result, metaUsedKey: usedKeyType });
  } catch (err: any) {
    console.error('Error in /api/analyze/noob-architecture:', err);
    res.status(500).json({ error: err.message || 'Error generando guía de arquitectura' });
  }
});

// Persona 3: Auditoría Pre-Entrega, Limpieza Anti-IA y Verificación
app.post('/api/analyze/pre-submission-audit', async (req, res) => {
  const { files, rubricDoc, apiOptions } = req.body;

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Debes proporcionar al menos un archivo Java para la auditoría pre-entrega.' });
  }

  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const prompt = `
Eres un auditor de entregas académicas de software en Java.
Tu tarea es revisar un proyecto ANTES de ser entregado en la plataforma de la universidad.

Debes detectar:
1. Rastros de generación por Inteligencia Artificial (comentarios sintéticos típicos como "Here is the implementation", "Note: this method handles...", comentarios genéricos innecesarios).
2. Archivos temporales o de sistema que no deben subirse (.DS_Store, .class, .idea, archivos de log).
3. Inconsistencias de paquetes Java, nombres de archivos .java que no coinciden con la declaración de clase pública.
4. Cumplimiento de las instrucciones de la rúbrica/profesor proporcionadas.

ARCHIVOS A AUDITAR:
${JSON.stringify(files, null, 2)}

INSTRUCCIONES DE LA RÚBRICA / ENTREGA:
${rubricDoc || 'Instrucciones estándar: código en español/inglés uniforme, compilable, sin artefactos temporales ni respuestas de bots en comentarios.'}

Devuelve la respuesta ÚNICAMENTE en JSON en español.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cleanScore: { type: Type.INTEGER, description: '0-100 score' },
              readyToSubmit: { type: Type.BOOLEAN },
              summary: { type: Type.STRING },
              detectedIssues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['AI_ARTIFACT', 'HIDDEN_FILE', 'NAMING_CONVENTION', 'MISSING_PACKAGE', 'DELIVERY_FORMAT'] },
                    severity: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
                    title: { type: Type.STRING },
                    location: { type: Type.STRING },
                    snippet: { type: Type.STRING },
                    suggestedFix: { type: Type.STRING }
                  },
                  required: ['id', 'type', 'severity', 'title', 'location', 'suggestedFix']
                }
              },
              rubricChecks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN },
                    note: { type: Type.STRING }
                  },
                  required: ['item', 'passed', 'note']
                }
              }
            },
            required: ['cleanScore', 'readyToSubmit', 'summary', 'detectedIssues', 'rubricChecks']
          }
        }
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

// Persona 4: Auditoría de Calidad SonarQube & Principios SOLID
app.post('/api/analyze/sonar-quality', async (req, res) => {
  const { files, apiOptions } = req.body;

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Debes proporcionar archivos Java para la inspección SonarQube.' });
  }

  try {
    const { result, usedKeyType } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const prompt = `
Eres un ingeniero de calidad de software especializado en SonarQube, métricas de código Java y principios SOLID.

Evalúa los siguientes archivos de código Java:
${JSON.stringify(files, null, 2)}

Informa sobre:
1. Quality Gate (PASSED, WARNING, FAILED).
2. Conteo de Code Smells (métodos muy largos, System.out en lugar de logger/excepciones, captura genérica Exception, magic numbers).
3. Rating de Complejidad Ciclomática (A a F).
4. Puntuación de adherencia a principios SOLID (0-100).
5. Violaciones detalladas con regla (ej: java:S106, java:S112, java:S1186) e instrucción para refactorizar.
6. Propuestas de casos de prueba JUnit 5 recomendados para maximizar la cobertura.

Devuelve la respuesta ÚNICAMENTE como JSON estructurado en español.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              qualityGate: { type: Type.STRING, enum: ['PASSED', 'FAILED', 'WARNING'] },
              codeSmellsCount: { type: Type.INTEGER },
              cyclomaticComplexityRating: { type: Type.STRING, enum: ['A', 'B', 'C', 'D', 'F'] },
              solidComplianceScore: { type: Type.INTEGER },
              issues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    ruleId: { type: Type.STRING },
                    ruleName: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['BLOCKER', 'CRITICAL', 'MAJOR', 'MINOR'] },
                    fileTarget: { type: Type.STRING },
                    lineNumber: { type: Type.INTEGER },
                    description: { type: Type.STRING },
                    refactoringHint: { type: Type.STRING }
                  },
                  required: ['ruleId', 'ruleName', 'severity', 'fileTarget', 'description', 'refactoringHint']
                }
              },
              junitRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    targetClass: { type: Type.STRING },
                    suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['targetClass', 'suggestedTests']
                }
              }
            },
            required: ['qualityGate', 'codeSmellsCount', 'cyclomaticComplexityRating', 'solidComplianceScore', 'issues', 'junitRecommendations']
          }
        }
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

// ----------------------------------------------------
// 5. AI JAVA TUTOR CHAT
// ----------------------------------------------------
app.post('/api/chat/tutor', async (req, res) => {
  const { message, context, apiOptions } = req.body;

  try {
    const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const systemPrompt = `
Eres un tutor universitario experto en Java II y revisión de proyectos académicos.
Tu objetivo es ayudar a la alumna (Blanca) a aprobar su asignatura de Java II.
Sé constructivo, claro, didáctico, amable y responde siempre en español. Si propones código, escribe código Java moderno (Java 17/21), limpio, bien estructurado y con comentarios aclaratorios.

Contexto del proyecto actual:
${JSON.stringify(context || {}, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `${systemPrompt}\n\nPregunta de la alumna: ${message}`
      });

      return response.text || 'Sin respuesta';
    });

    res.json({ text: result });
  } catch (err: any) {
    console.error('Error in /api/chat/tutor:', err);
    res.status(500).json({ error: err.message || 'Error en la respuesta del tutor IA' });
  }
});

// ----------------------------------------------------
// 6. GENERATE IMPROVED JAVA FILE
// ----------------------------------------------------
app.post('/api/generate/improved-file', async (req, res) => {
  const { fileTarget, currentCode, proposalsToApply, teacherDoc, apiOptions } = req.body;

  try {
    const { result } = await executeWithAiFallback(apiOptions || {}, async (ai) => {
      const prompt = `
Aplica las siguientes propuestas de mejora al archivo de Java "${fileTarget}":

CÓDIGO ACTUAL:
\`\`\`java
${currentCode}
\`\`\`

PROPUESTAS A APLICAR:
${JSON.stringify(proposalsToApply, null, 2)}

INDICACIONES DE LA PROFESORA:
${teacherDoc}

Genera el código Java completo final corregido y optimizado. Devuelve SOLO el código Java sin bloques markdown de tres comillas invertidas extra si es posible, o bien formateado limpiamente.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });

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

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Java II Review Studio listening on port ${PORT}`);
  });
}

start();
