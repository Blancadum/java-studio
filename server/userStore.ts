import { UserProfile, SavedSession, UserApiConfig } from '../src/data/types';

// In-memory user database with default demo user
const usersDatabase: Map<string, { passwordHash: string; profile: UserProfile }> = new Map();

// Initialize default author account
const defaultUserEmail = 'blancadum@gmail.com';
usersDatabase.set(defaultUserEmail, {
  passwordHash: 'java2026', // Simple demo hash
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

export function registerUser(email: string, name: string, password: string): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  if (usersDatabase.has(normalizedEmail)) {
    throw new Error('El correo electrónico ya está registrado.');
  }

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
    passwordHash: password,
    profile: newUser
  });

  return newUser;
}

export function loginUser(email: string, password: string): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);

  if (!entry || entry.passwordHash !== password) {
    throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
  }

  return entry.profile;
}

export function getUserProfile(email: string): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) {
    // Auto-create guest account if not found
    return registerUser(normalizedEmail, normalizedEmail.split('@')[0], 'pass123');
  }
  return entry.profile;
}

export function updateUserApiConfig(email: string, config: Partial<UserApiConfig>): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) throw new Error('Usuario no encontrado');

  const currentConfig = entry.profile.apiConfig;

  if (config.geminiUserKey !== undefined) {
    currentConfig.geminiUserKey = config.geminiUserKey;
    currentConfig.maskedGeminiKey = maskKey(config.geminiUserKey);
  }

  if (config.backupUserKey !== undefined) {
    currentConfig.backupUserKey = config.backupUserKey;
    currentConfig.maskedBackupKey = maskKey(config.backupUserKey);
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

export function saveUserSession(email: string, sessionData: Omit<SavedSession, 'id' | 'createdAt'>): SavedSession {
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

export function toggleUser2FA(email: string, enabled: boolean): UserProfile {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = usersDatabase.get(normalizedEmail);
  if (!entry) throw new Error('Usuario no encontrado');

  entry.profile.twoFactorAuth = {
    enabled,
    secret: enabled ? 'J4V4-STUDI0-2FA-9876-AUTH' : undefined
  };

  return entry.profile;
}
