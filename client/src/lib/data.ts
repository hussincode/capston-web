import { ProjectCardProps } from "@/components/ProjectCard";

// Project data
export const projects: ProjectCardProps[] = [
  {
    id: "1",
    title: "Smart Home Automation",
    description: "A system that automates home functions through IoT devices and a centralized control app.",
    category: "Technology",
    categoryColor: "technology",
    tags: ["IoT", "Mobile App", "Hardware"],
    teamName: "Alpha",
    teamMembers: [
      { id: "1", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "2", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "3", avatarUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: "2",
    title: "AI Learning Assistant",
    description: "An intelligent tutoring system that adapts to student learning patterns and provides personalized support.",
    category: "AI/ML",
    categoryColor: "ai/ml",
    tags: ["Machine Learning", "Education Tech", "Python"],
    teamName: "Nexus",
    teamMembers: [
      { id: "1", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "2", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "3", avatarUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  },
  {
    id: "3",
    title: "Eco-Friendly City Planning",
    description: "A sustainable urban design model that optimizes energy usage and reduces environmental impact.",
    category: "Sustainability",
    categoryColor: "sustainability",
    tags: ["Urban Planning", "3D Modeling", "Green Energy"],
    teamName: "Verde",
    teamMembers: [
      { id: "1", avatarUrl: "https://images.unsplash.com/photo-1607569708678-59753d8730c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "2", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
      { id: "3", avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
  }
];

// Testimonial data
export const testimonials = [
  {
    quote: "My capstone project helped me land my dream internship! The practical skills I gained working on our AI project set me apart from other candidates.",
    name: "Sarah Johnson",
    role: "Computer Science, Team Nexus",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    quote: "Leading our sustainability project taught me how to manage a team, handle project timelines, and present our work to stakeholders with confidence.",
    name: "David Rivera",
    role: "Environmental Science, Team Leader",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    quote: "The challenges we overcame during our engineering capstone prepared me for real-world problem-solving. It was the most valuable experience of my education.",
    name: "Maya Patel",
    role: "Electrical Engineering, Team Alpha",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

// Contact information
export const contactInfo = [
  {
    icon: "ri-mail-line",
    title: "Email Us",
    content: "capstone@elsewedy.edu",
    index: 0
  },
  {
    icon: "ri-phone-line",
    title: "Call Us",
    content: "+20 12 3456 7890",
    index: 1
  },
  {
    icon: "ri-map-pin-line",
    title: "Visit Us",
    content: "Elsewedy Technical Academy, Cairo, Egypt",
    index: 2
  }
];
