import { GoogleGenAI } from '@google/genai';

export interface AiRequestOptions {
  customApiKey?: string;
  provider?: 'app_default' | 'user_gemini' | 'backup_fallback';
  backupKey?: string;
}

/**
 * Creates a GoogleGenAI client with key fallback strategy.
 */
export function getGenAIClient(options?: AiRequestOptions): { ai: GoogleGenAI; activeKeyType: string } {
  let selectedKey = process.env.GEMINI_API_KEY || '';
  let keyType = 'App Default Key';

  if (options?.provider === 'user_gemini' && options?.customApiKey && options.customApiKey.trim().length > 5) {
    selectedKey = options.customApiKey.trim();
    keyType = 'User Custom Gemini Key';
  } else if (options?.provider === 'backup_fallback' && options?.backupKey && options.backupKey.trim().length > 5) {
    selectedKey = options.backupKey.trim();
    keyType = 'Backup Fallback Key';
  }

  if (!selectedKey) {
    // Last resort fallback to environment variable
    selectedKey = process.env.GEMINI_API_KEY || '';
  }

  const ai = new GoogleGenAI({
    apiKey: selectedKey,
  });

  return { ai, activeKeyType: keyType };
}

/**
 * Executes a Gemini request with automatic fallback retry if quota/error is hit.
 */
export async function executeWithAiFallback<T>(
  options: AiRequestOptions,
  executeFn: (ai: GoogleGenAI) => Promise<T>
): Promise<{ result: T; usedKeyType: string }> {
  const primary = getGenAIClient(options);

  try {
    const result = await executeFn(primary.ai);
    return { result, usedKeyType: primary.activeKeyType };
  } catch (err: any) {
    console.warn(`Primary AI execution failed (${primary.activeKeyType}): ${err.message}. Attempting fallback...`);

    // If custom key failed, try system default
    if (primary.activeKeyType !== 'App Default Key' && process.env.GEMINI_API_KEY) {
      const fallback = getGenAIClient({ provider: 'app_default' });
      const result = await executeFn(fallback.ai);
      return { result, usedKeyType: 'App Default Key (Fallback)' };
    }

    throw err;
  }
}
