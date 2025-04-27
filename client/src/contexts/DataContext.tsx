import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Types for data management
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  tags: string[];
  teamName: string;
  teamMembers: TeamMember[];
  imageUrl: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  progress: number;
  objectives: string[];
  resources: { name: string; url: string }[];
  tasks: Task[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  dueDate: string;
  assignedTo: TeamMember[];
  priority: 'high' | 'medium' | 'low';
  createdBy: string;
  createdAt: string;
  notifications?: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  taskId?: string;
}

interface DataContextType {
  projects: Project[];
  notifications: Notification[];
  getProjectById: (id: string) => Project | undefined;
  getTasksForUser: (email: string) => Task[];
  getNotificationsForUser: (email: string) => Notification[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
}

// Create the context
const DataContext = createContext<DataContextType>({} as DataContextType);

// Sample team members
const sampleTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Team Leader',
    avatarUrl: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Developer',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Designer',
    avatarUrl: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Emily Davis',
    role: 'Researcher',
    avatarUrl: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Alex Wilson',
    role: 'Developer',
    avatarUrl: 'https://i.pravatar.cc/150?img=8'
  }
];

// Sample tasks
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Complete initial design mockups',
    description: 'Create wireframes and high-fidelity mockups for the main dashboard and user profile pages.',
    status: 'completed',
    dueDate: '2025-04-15',
    assignedTo: [sampleTeamMembers[2], sampleTeamMembers[3]],
    priority: 'high',
    createdBy: 'manager@example.com',
    createdAt: '2025-04-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up user registration, login, and password reset functionality.',
    status: 'in-progress',
    dueDate: '2025-04-29',
    assignedTo: [sampleTeamMembers[1], sampleTeamMembers[4]],
    priority: 'high',
    createdBy: 'manager@example.com',
    createdAt: '2025-04-10T14:30:00Z'
  },
  {
    id: '3',
    title: 'Develop data visualization components',
    description: 'Create charts and graphs to visualize project progress and metrics.',
    status: 'pending',
    dueDate: '2025-05-10',
    assignedTo: [sampleTeamMembers[1]],
    priority: 'medium',
    createdBy: 'leader@example.com',
    createdAt: '2025-04-12T09:15:00Z'
  },
  {
    id: '4',
    title: 'Write technical documentation',
    description: 'Document the API endpoints, data models, and component usage guidelines.',
    status: 'pending',
    dueDate: '2025-05-15',
    assignedTo: [sampleTeamMembers[3]],
    priority: 'low',
    createdBy: 'manager@example.com',
    createdAt: '2025-04-18T16:45:00Z'
  }
];

// Sample projects
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Smart City IoT Solution',
    description: 'Developing an IoT-based solution for smart city management and monitoring',
    category: 'IoT',
    categoryColor: 'bg-blue-100 text-blue-800',
    tags: ['IoT', 'Smart City', 'Sensors', 'Data Analysis'],
    teamName: 'Team Innovate',
    teamMembers: sampleTeamMembers,
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600',
    projectDescription: 'This project aims to develop an integrated IoT solution for smart city management. The system will collect data from various sensors around the city to monitor traffic flow, air quality, energy usage, and waste management. Real-time data analytics will provide insights to city officials for better decision-making and resource allocation. The platform will also include a citizen portal to provide transparency and enable community engagement.',
    startDate: '2025-04-01',
    endDate: '2025-07-31',
    progress: 35,
    objectives: [
      'Develop a network of IoT sensors for data collection',
      'Create a central data hub for information processing',
      'Implement real-time analytics and visualization tools',
      'Design a user-friendly dashboard for city officials',
      'Build a public portal for citizen access to relevant data'
    ],
    resources: [
      { name: 'Project Documentation', url: 'https://example.com/docs' },
      { name: 'Design Assets', url: 'https://example.com/designs' },
      { name: 'API Specifications', url: 'https://example.com/api' }
    ],
    tasks: [sampleTasks[0], sampleTasks[1]]
  },
  {
    id: '2',
    title: 'AI Learning Assistant',
    description: 'Creating an AI-powered educational assistant to help students with personalized learning',
    category: 'Education',
    categoryColor: 'bg-purple-100 text-purple-800',
    tags: ['AI', 'Education', 'Machine Learning', 'Personalization'],
    teamName: 'Team Nexus',
    teamMembers: [sampleTeamMembers[0], sampleTeamMembers[1], sampleTeamMembers[3]],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=600',
    projectDescription: 'The AI Learning Assistant project focuses on developing an intelligent educational platform that adapts to individual student needs. Using machine learning algorithms, the system will analyze student performance and learning patterns to create personalized learning paths. The assistant will provide targeted resources, exercises, and feedback to optimize the learning process and improve educational outcomes.',
    startDate: '2025-03-15',
    endDate: '2025-08-30',
    progress: 45,
    objectives: [
      'Develop core AI algorithms for learning pattern recognition',
      'Create a student performance analysis module',
      'Implement adaptive content recommendation system',
      'Design an engaging user interface for students of various age groups',
      'Build analytics dashboard for teachers and administrators'
    ],
    resources: [
      { name: 'Research Paper', url: 'https://example.com/research' },
      { name: 'UI Prototypes', url: 'https://example.com/prototypes' },
      { name: 'ML Model Documentation', url: 'https://example.com/ml-docs' }
    ],
    tasks: [sampleTasks[2], sampleTasks[3]]
  }
];

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task Assigned',
    message: 'You have been assigned to the task "Implement authentication system"',
    type: 'info',
    timestamp: '2025-04-10T14:35:00Z',
    isRead: false,
    taskId: '2'
  },
  {
    id: '2',
    title: 'Task Completed',
    message: 'The task "Complete initial design mockups" has been marked as completed',
    type: 'success',
    timestamp: '2025-04-15T16:20:00Z',
    isRead: true,
    taskId: '1'
  },
  {
    id: '3',
    title: 'Upcoming Deadline',
    message: 'The task "Implement authentication system" is due in 2 days',
    type: 'warning',
    timestamp: '2025-04-27T09:00:00Z',
    isRead: false,
    taskId: '2'
  }
];

// Create the provider
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  // Load data from localStorage on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    const storedNotifications = localStorage.getItem('notifications');
    
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
    
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);
  
  // Get a project by ID
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id);
  };
  
  // Get tasks for a specific user
  const getTasksForUser = (email: string) => {
    const userName = email.split('@')[0];
    const allTasks: Task[] = [];
    
    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.assignedTo.some(member => member.name.toLowerCase() === userName.toLowerCase()) ||
            task.createdBy === email) {
          allTasks.push(task);
        }
      });
    });
    
    return allTasks;
  };
  
  // Get notifications for a specific user
  const getNotificationsForUser = (email: string) => {
    const userName = email.split('@')[0];
    
    // For a real application, you would filter notifications based on the user
    // For this demo, we're returning all notifications
    return notifications;
  };
  
  // Add a new project
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: generateId()
    };
    
    setProjects(prevProjects => [...prevProjects, newProject]);
  };
  
  // Update an existing project
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };
  
  // Delete a project
  const deleteProject = (id: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
  };
  
  // Add a new task to a project
  const addTask = (projectId: string, task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, tasks: [...project.tasks, newTask] } 
          : project
      )
    );
    
    // Create a notification for assigned team members
    task.assignedTo.forEach(member => {
      addNotification({
        title: 'New Task Assigned',
        message: `You have been assigned to the task "${task.title}"`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false,
        taskId: newTask.id
      });
    });
  };
  
  // Update an existing task
  const updateTask = (projectId: string, taskId: string, updates: Partial<Task>) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? {
              ...project,
              tasks: project.tasks.map(task => 
                task.id === taskId ? { ...task, ...updates } : task
              )
            } 
          : project
      )
    );
    
    // If the status changed to completed, create a notification
    if (updates.status === 'completed') {
      const project = projects.find(p => p.id === projectId);
      const task = project?.tasks.find(t => t.id === taskId);
      
      if (task) {
        addNotification({
          title: 'Task Completed',
          message: `The task "${task.title}" has been marked as completed`,
          type: 'success',
          timestamp: new Date().toISOString(),
          isRead: false,
          taskId: taskId
        });
      }
    }
  };
  
  // Delete a task from a project
  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) } 
          : project
      )
    );
  };
  
  // Mark a notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  // Dismiss a notification
  const dismissNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: generateId()
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };
  
  return (
    <DataContext.Provider
      value={{
        projects,
        notifications,
        getProjectById,
        getTasksForUser,
        getNotificationsForUser,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        addNotification
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Create a hook to use the context
export const useData = () => useContext(DataContext);