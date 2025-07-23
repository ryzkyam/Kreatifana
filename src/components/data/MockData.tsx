import { User, Portfolio, AdminStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'creator',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150&h=150&fit=crop&crop=face',
    bio: 'Digital artist and UI/UX designer with 5+ years of experience creating beautiful, user-centered designs.',
    location: 'San Francisco, CA',
    skills: ['UI/UX Design', 'Digital Art', 'Branding', 'Figma', 'Adobe Creative Suite'],
    joinDate: '2023-01-15',
    isActive: true,
    portfolioCount: 12,
    cvUrl: '/cv/sarah-johnson.pdf',
    website: 'https://sarahjohnson.design',
    social: {
      linkedin: 'sarah-johnson-design',
      behance: 'sarahj_design',
      dribbble: 'sarah_creates'
    }
  },
  {
    id: '2',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    role: 'creator',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer and creative technologist specializing in interactive experiences.',
    location: 'New York, NY',
    skills: ['Web Development', 'Creative Coding', 'Three.js', 'React', 'Node.js'],
    joinDate: '2023-02-20',
    isActive: true,
    portfolioCount: 8,
    cvUrl: '/cv/marcus-chen.pdf',
    website: 'https://marcuschen.dev',
    social: {
      linkedin: 'marcus-chen-dev',
      dribbble: 'marcus_codes'
    }
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    role: 'creator',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face',
    bio: 'Brand strategist and graphic designer helping startups build memorable visual identities.',
    location: 'Austin, TX',
    skills: ['Brand Design', 'Logo Design', 'Typography', 'Packaging Design', 'Strategy'],
    joinDate: '2023-03-10',
    isActive: true,
    portfolioCount: 15,
    cvUrl: '/cv/emma-rodriguez.pdf',
    social: {
      linkedin: 'emma-rodriguez-brand',
      behance: 'emma_brands',
      instagram: 'emma.designs'
    }
  }
];

export const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    title: 'E-commerce Mobile App Design',
    description: 'Complete UI/UX design for a modern e-commerce mobile application with focus on user experience and conversion optimization.',
    category: 'Mobile Design',
    images: [
      'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?w=800',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800'
    ],
    creator: mockUsers[0],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    tags: ['UI/UX', 'Mobile', 'E-commerce', 'Figma'],
    likes: 245,
    views: 1280,
    status: 'published',
    featured: true
  },
  {
    id: '2',
    title: 'Interactive 3D Portfolio Website',
    description: 'Creative portfolio website built with Three.js featuring interactive 3D elements and smooth animations.',
    category: 'Web Development',
    images: [
      'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?w=800',
      'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=800'
    ],
    creator: mockUsers[1],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    tags: ['Three.js', 'React', 'Animation', '3D'],
    likes: 189,
    views: 956,
    status: 'published',
    featured: true
  },
  {
    id: '3',
    title: 'Startup Brand Identity Package',
    description: 'Complete brand identity design for a tech startup including logo, typography, color palette, and brand guidelines.',
    category: 'Branding',
    images: [
      'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?w=800',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=800'
    ],
    creator: mockUsers[2],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    tags: ['Branding', 'Logo Design', 'Typography', 'Strategy'],
    likes: 324,
    views: 1456,
    status: 'published',
    featured: false
  }
];

export const mockAdminStats: AdminStats = {
  totalUsers: 1247,
  totalPortfolios: 3892,
  activeUsers: 892,
  pendingApprovals: 23,
  monthlyGrowth: 12.5,
  topCategories: [
    { name: 'UI/UX Design', count: 1245 },
    { name: 'Branding', count: 892 },
    { name: 'Web Development', count: 674 },
    { name: 'Illustration', count: 523 },
    { name: 'Photography', count: 445 }
  ]
};