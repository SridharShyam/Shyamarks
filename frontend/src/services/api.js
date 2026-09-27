const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function getAuthHeaders() {
  const token = localStorage.getItem('shyamarks_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('shyamarks_token');
    }
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage = typeof errorData.detail === 'string'
      ? errorData.detail
      : Array.isArray(errorData.detail)
      ? errorData.detail.map((e) => e.msg).join(', ')
      : 'API Request Failed';
    throw new Error(errorMessage);
  }
  if (response.status === 204) {
    return {};
  }
  return response.json();
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      localStorage.removeItem('shyamarks_token');
    }
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Achievements
  getAchievements: async (filters = {}) => {
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

  getAchievementBySlug: async (slug) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/slug/${slug}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getAchievementById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createAchievement: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateAchievement: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteAchievement: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/achievements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Skills
  getSkills: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getSkillById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createSkill: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateSkill: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteSkill: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Projects
  getProjects: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getProjectBySlug: async (slug) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/slug/${slug}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getProjectById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createProject: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateProject: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Experiences
  getExperiences: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getExperienceById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createExperience: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateExperience: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteExperience: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/experiences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Issuers
  getIssuers: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getIssuerById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  createIssuer: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  updateIssuer: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteIssuer: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/issuers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // File Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('shyamarks_token');
    
    const headers = {};
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
