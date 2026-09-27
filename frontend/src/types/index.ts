export type AchievementType =
  | 'Certification'
  | 'Internship'
  | 'Virtual Experience'
  | 'Workshop'
  | 'Course'
  | 'Competition'
  | 'Award'
  | 'Project'
  | 'Publication'
  | 'Hackathon'
  | 'Training'
  | 'Other';

export type VisibilityType = 'public' | 'private' | 'unlisted';

export interface Issuer {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  created_at?: string;
}

export interface EvidenceBreakdown {
  certifications: number;
  projects: number;
  experiences: number;
  internships: number;
  virtual_experiences: number;
  workshops: number;
  courses: number;
  awards: number;
  total: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
  created_at?: string;
  ccs?: number;
  evidence_breadth_gap?: boolean;
  unanchored?: boolean;
  evidence_breakdown?: EvidenceBreakdown;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  skill_ids: string[];
  achievement_ids: string[];
  github_url?: string;
  live_url?: string;
  tags: string[];
  created_at?: string;
}

export type ExperienceType = 'Internship' | 'Research' | 'Volunteer' | 'Other';

export interface Experience {
  id: string;
  title: string;
  organization: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
  skill_ids: string[];
  achievement_ids: string[];
  type: ExperienceType;
  created_at?: string;
}

export interface Achievement {
  id: string;
  title: string;
  type: AchievementType;
  description: string;
  issuer_id?: string;
  issued_date: string;
  expiry_date?: string;
  skill_ids: string[];
  project_ids: string[];
  experience_ids: string[];
  credential_id?: string;
  verification_url?: string;
  credential_url?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  preview_image_url?: string;
  visibility: VisibilityType;
  featured: boolean;
  slug: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
  issuer?: Issuer;
  skills?: Skill[];
  projects?: Project[];
  experiences?: Experience[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AchievementFilters {
  search?: string;
  type?: string;
  issuer_id?: string;
  skill_id?: string;
  year?: number;
  featured?: boolean;
  sort?: 'newest' | 'oldest' | 'title';
  page?: number;
  limit?: number;
}
