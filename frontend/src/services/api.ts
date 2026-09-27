import {
  Achievement,
  AchievementFilters,
  AuthUser,
  Experience,
  Issuer,
  PaginatedResponse,
  Project,
  Skill
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('shyamarks_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('shyamarks_token');
    }
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage = typeof errorData.detail === 'string'
      ? errorData.detail
      : Array.isArray(errorData.detail)
      ? errorData.detail.map((e: any) => e.msg).join(', ')
      : 'API Request Failed';
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return {} as T;
  }
  return response.json();
}

export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ access_token: string; token_type: string }> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem('shyamarks_token');
    }
  },

  getMe: async (): Promise<AuthUser> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Achievements
  getAchievements: async (filters: AchievementFilters = {}): Promise<PaginatedResponse<Achievement>> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.issuer_id) params.append('issuer_id', filters.issuer_id);
    if (filters.skill_id) params.append('skill_id', filters.skill_id);
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const res = await fetch(`${API_BASE_URL}/api/v1/achievements?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAchievementBySlug: async (slug: string): Promise<Achievement> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/slug/${slug}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAchievementById: async (id: string): Promise<Achievement> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createAchievement: async (data: Partial<Achievement>): Promise<Achievement> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateAchievement: async (id: string, data: Partial<Achievement>): Promise<Achievement> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteAchievement: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getSkillById: async (id: string): Promise<Skill> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createSkill: async (data: Partial<Skill>): Promise<Skill> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateSkill: async (id: string, data: Partial<Skill>): Promise<Skill> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteSkill: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getProjectBySlug: async (slug: string): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/slug/${slug}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getProjectById: async (id: string): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createProject: async (data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getExperienceById: async (id: string): Promise<Experience> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createExperience: async (data: Partial<Experience>): Promise<Experience> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateExperience: async (id: string, data: Partial<Experience>): Promise<Experience> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteExperience: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Issuers
  getIssuers: async (): Promise<Issuer[]> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getIssuerById: async (id: string): Promise<Issuer> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createIssuer: async (data: Partial<Issuer>): Promise<Issuer> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateIssuer: async (id: string, data: Partial<Issuer>): Promise<Issuer> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteIssuer: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // File Upload
  uploadFile: async (file: File): Promise<{ file_url: string; file_type: string; file_size: number; preview_url?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('shyamarks_token');
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/uploads`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};
