export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  projectUrl?: string;
  githubUrl?: string;
  category: string;
  featured: boolean;
  completedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  pricing: string;
  deliveryTime: string;
  category: string;
  active: boolean;
  imageUrl?: string;
}

export interface Order {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}
