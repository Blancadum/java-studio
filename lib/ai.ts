import { GoogleGenAI } from '@google/genai';

export async function runAI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada.');
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });
  return response.text || '';
}

export async function runAIJson(prompt: string, schema: any): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada.');
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: schema },
  });
  return JSON.parse(response.text!);
}
