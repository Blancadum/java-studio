import * as bcrypt from 'bcrypt';
import { UserProfile, SavedSession, UserApiConfig } from '../src/data/types';

// In-memory user database with default demo user
const usersDatabase: Map<string, { passwordHash: string; profile: UserProfile }> = new Map();

const saltRounds = 10;

// Initialize default author account
const defaultUserEmail = 'blancadum@gmail.com';
usersDatabase.set(defaultUserEmail, {
  passwordHash: bcrypt.hashSync('java2026', saltRounds),
  profile: {
    id: 'usr_blanca_1',
    name: 'Blanca Dumont',
    email: defaultUserEmail,
    institution: 'Instituto de Educación Superior Tecnológica',
    totalTokensSaved: 124500,
    apiConfig: {
      preferredProvider: 'app_default',
      activeModelName: 'gemini-2.0-flash',
      maskedGeminiKey: '',
      maskedBackupKey: '',
      fallbackEnabled: true,
    },
    twoFactorAuth: {
      enabled: false,
    },
    sessions: [
      {
        id: 'sess_sample_1',
        title: 'Sistema Reservas Java II - Evaluacion Inicial',
        createdAt: new Date().toISOString(),
        personaMode: 'FEEDBACK_REVISION',
        score: 85,
        tokensSaved: 18500,
        summary: 'Análisis de la revisión del proyecto de reservas. Corregidas excepciones personalizadas y encapsulamiento.',
        payload: {}
      }
    ]
  }
});

export function maskKey(key?: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export async function registerUser(email: string, name: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  if (usersDatabase.has(normalizedEmail)) {
    throw new Error('El correo electrónico ya está registrado.');
  }

  const passwordHash = bcrypt.hashSync(password, saltRounds);

  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name,
    email: normalizedEmail,
    institution: 'Universidad / Instituto Java',
    totalTokensSaved: 0,
    apiConfig: {
      preferredProvider: 'app_default',
      activeModelName: 'gemini-2.0-flash',
      maskedGeminiKey: '',
      maskedBackupKey: '',
      fallbackEnabled: true,
    },
    twoFactorAuth: {
      enabled: false,
    },
    sessions: []
  };

  usersDatabase.set(normalizedEmail, {
    passwordHash: passwordHash,
    profile: newUser
  });

  return newUser;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);

  const passwordMatches = entry ? bcrypt.compareSync(password, entry.passwordHash) : false;

  if (!passwordMatches) {
    throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
  }

  return entry!.profile;
}

export async function getUserProfile(email: string): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) {
    // Auto-create guest account if not found
    return registerUser(normalizedEmail, normalizedEmail.split('@')[0], 'pass123');
  }
  return entry.profile;
}

export async function updateUserApiConfig(email: string, config: Partial<UserApiConfig>): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) throw new Error('Usuario no encontrado');

  const currentConfig = entry.profile.apiConfig;

  // Guardar clave de cualquier proveedor genéricamente
  const providers = ['gemini', 'openai', 'claude', 'mistral', 'deepseek', 'groq', 'cohere', 'xai', 'perplexity', 'together', 'azure', 'ollama'];
  for (const provider of providers) {
    const keyField = `${provider}UserKey`;
    if ((config as any)[keyField] !== undefined) {
      (currentConfig as any)[keyField] = (config as any)[keyField];
      (currentConfig as any)[`masked${provider.charAt(0).toUpperCase() + provider.slice(1)}Key`] = maskKey((config as any)[keyField]);
    }
  }

  if (config.preferredProvider) {
    currentConfig.preferredProvider = config.preferredProvider;
  }

  if (config.activeModelName) {
    currentConfig.activeModelName = config.activeModelName;
  }

  if (config.fallbackEnabled !== undefined) {
    currentConfig.fallbackEnabled = config.fallbackEnabled;
  }

  return entry.profile;
}

export async function saveUserSession(email: string, sessionData: Omit<SavedSession, 'id' | 'createdAt'>): Promise<SavedSession> {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) throw new Error('Usuario no encontrado');

  const newSession: SavedSession = {
    ...sessionData,
    id: `sess_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  entry.profile.sessions.unshift(newSession);
  entry.profile.totalTokensSaved += newSession.tokensSaved || 15000;

  return newSession;
}

export async function toggleUser2FA(email: string, enabled: boolean): Promise<UserProfile> {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) throw new Error('Usuario no encontrado');

  entry.profile.twoFactorAuth = {
    enabled,
    secret: enabled ? 'J4V4-STUDI0-2FA-9876-AUTH' : undefined
  };

  return entry.profile;
}
