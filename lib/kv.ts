import { Redis } from '@upstash/redis';
import * as bcrypt from 'bcrypt';
import { UserProfile, SavedSession, UserApiConfig } from '../src/data/types';

const kv = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

function userKey(email: string) { return `user:${email.toLowerCase().trim()}`; }
function passKey(email: string) { return `pass:${email.toLowerCase().trim()}`; }
function maskKey(key?: string): string {
  if (!key || key.length < 8) return '';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

const saltRounds = 10;

const DEFAULT_USER: UserProfile = {
  id: 'usr_blanca_1',
  name: 'Blanca Dumont',
  email: 'blanca@estudiante.edu',
  institution: 'Instituto de Educación Superior Tecnológica',
  totalTokensSaved: 124500,
  apiConfig: { preferredProvider: 'app_default', activeModelName: 'gemini-2.0-flash', maskedGeminiKey: '', maskedBackupKey: '', fallbackEnabled: true },
  twoFactorAuth: { enabled: false },
  sessions: [],
};

export async function registerUser(email: string, name: string, password: string): Promise<UserProfile> {
  const existing = await kv.get(userKey(email));
  if (existing) throw new Error('El correo electrónico ya está registrado.');

  const passwordHash = await bcrypt.hash(password, saltRounds);
  const profile: UserProfile = {
    id: `usr_${Date.now()}`, name, email: email.toLowerCase().trim(),
    institution: 'Universidad / Instituto Java', totalTokensSaved: 0,
    apiConfig: { preferredProvider: 'app_default', activeModelName: 'gemini-2.0-flash', maskedGeminiKey: '', maskedBackupKey: '', fallbackEnabled: true },
    twoFactorAuth: { enabled: false }, sessions: [],
  };
  await kv.set(userKey(email), profile);
  await kv.set(passKey(email), passwordHash);
  return profile;
}

export async function loginUser(email: string, password: string): Promise<UserProfile> {
  const stored = await kv.get<string>(passKey(email));
  const passwordMatches = stored ? await bcrypt.compare(password, stored) : false;

  if (!passwordMatches) throw new Error('Credenciales incorrectas.');
  const profile = await kv.get<UserProfile>(userKey(email));
  if (!profile) throw new Error('Usuario no encontrado.');
  return profile;
}

export async function getUserProfile(email: string): Promise<UserProfile> {
  const profile = await kv.get<UserProfile>(userKey(email));
  if (!profile) {
    if (email === DEFAULT_USER.email) {
      await kv.set(userKey(email), DEFAULT_USER);
      const defaultPasswordHash = await bcrypt.hash('java2026', saltRounds);
      await kv.set(passKey(email), defaultPasswordHash);
      return DEFAULT_USER;
    }
    return registerUser(email, email.split('@')[0], 'pass123');
  }
  return profile;
}

export async function updateUserApiConfig(email: string, config: Partial<UserApiConfig>): Promise<UserProfile> {
  const profile = await getUserProfile(email);
  if (config.geminiUserKey !== undefined) { profile.apiConfig.geminiUserKey = config.geminiUserKey; profile.apiConfig.maskedGeminiKey = maskKey(config.geminiUserKey); }
  if (config.backupUserKey !== undefined) { profile.apiConfig.backupUserKey = config.backupUserKey; profile.apiConfig.maskedBackupKey = maskKey(config.backupUserKey); }
  if (config.preferredProvider) profile.apiConfig.preferredProvider = config.preferredProvider;
  if (config.activeModelName) profile.apiConfig.activeModelName = config.activeModelName;
  if (config.fallbackEnabled !== undefined) profile.apiConfig.fallbackEnabled = config.fallbackEnabled;
  await kv.set(userKey(email), profile);
  return profile;
}

export async function saveUserSession(email: string, sessionData: Omit<SavedSession, 'id' | 'createdAt'>): Promise<SavedSession> {
  const profile = await getUserProfile(email);
  const newSession: SavedSession = { ...sessionData, id: `sess_${Date.now()}`, createdAt: new Date().toISOString() };
  profile.sessions = [newSession, ...(profile.sessions || [])];
  profile.totalTokensSaved = (profile.totalTokensSaved || 0) + (newSession.tokensSaved || 15000);
  await kv.set(userKey(email), profile);
  return newSession;
}

export async function toggleUser2FA(email: string, enabled: boolean): Promise<UserProfile> {
  const profile = await getUserProfile(email);
  profile.twoFactorAuth = { enabled, secret: enabled ? 'J4V4-STUDI0-2FA-9876-AUTH' : undefined };
  await kv.set(userKey(email), profile);
  return profile;
}
