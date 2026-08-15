import { UserApiConfig, SavedSession } from '../data/types';

let jwtToken: string | null = null;

export function setAuthToken(token: string | null) {
  jwtToken = token;
  if (token) {
    localStorage.setItem('jwt_token', token);
  } else {
    localStorage.removeItem('jwt_token');
  }
}

export function getAuthToken(): string | null {
  if (!jwtToken) {
    jwtToken = localStorage.getItem('jwt_token');
  }
  return jwtToken;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    setAuthToken(null);
    console.error('Authentication error (401). Token cleared.');
    // In a real app, you might trigger a redirect to /login here
  }

  return response;
}

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Error de red o respuesta no válida' }));
    throw new Error(errorData.error || `Error ${response.status}`);
  }
  return response.json();
};

export const api = {
  getProfile: async () => {
    const response = await fetchWithAuth('/api/user/profile');
    return handleApiResponse(response);
  },
  saveSession: async (sessionData: Omit<SavedSession, 'id' | 'createdAt'>) => {
    const response = await fetchWithAuth('/api/user/sessions/save', {
      method: 'POST',
      body: JSON.stringify({ sessionData }),
    });
    return handleApiResponse(response);
  },
  analyze: async (endpoint: string, body: any) => {
    const response = await fetchWithAuth(`/api/analyze/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },
  generateImprovedFile: async (body: any) => {
    const response = await fetchWithAuth('/api/generate/improved-file', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },
  chatWithTutor: async (body: any) => {
    const response = await fetchWithAuth('/api/chat/tutor', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return handleApiResponse(response);
  },
  updateUserApiConfig: async (config: Partial<UserApiConfig>) => {
    const response = await fetchWithAuth('/api/user/api-config', {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
    return handleApiResponse(response);
  },
  toggleUser2FA: async (enabled: boolean) => {
    const response = await fetchWithAuth('/api/user/2fa/toggle', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
    return handleApiResponse(response);
  }
};