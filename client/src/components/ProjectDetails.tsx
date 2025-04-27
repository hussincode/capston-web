import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertCircle,
  BarChart4,
  Link2,
  Code,
  MessageSquare,
  PlusCircle,
  X
} from 'lucide-react';
import { fadeInUp } from '@/lib/animations';
import { ProjectCardProps } from '@/components/ProjectCard';
import { useAuth } from '@/hooks/useAuth';

// Types for tasks
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  dueDate: string;
  assignedTo: string[];
  priority: 'high' | 'medium' | 'low';
  comments?: Comment[];
}

interface Comment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

// Extended project details
interface ProjectDetailsProps extends ProjectCardProps {
  projectDescription: string;
  startDate: string;
  endDate: string;
  progress: number;
  objectives: string[];
  resources: { name: string; url: string }[];
  teamMembers: { 
    id: string; 
    name: string; 
    role: string; 
    avatarUrl: string; 
  }[];
  tasks: Task[];
  onTaskAdd?: (task: Omit<Task, 'id'>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  id,
  title,
  description,
  projectDescription,
  category,
  categoryColor,
  tags,
  teamName,
  teamMembers,
  imageUrl,
  startDate,
  endDate,
  progress,
  objectives,
  resources,
  tasks,
  onTaskAdd,
  onTaskUpdate
}) => {
  const { user } = useAuth();
  const isManagerOrLeader = user?.role === 'manager' || user?.role === 'leader';
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'upcoming' as 'upcoming' | 'in-progress' | 'completed',
    dueDate: new Date().toISOString().substring(0, 10),
    assignedTo: [] as string[],
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleAddTask = () => {
    if (onTaskAdd && newTask.title.trim() !== '') {
      onTaskAdd(newTask);
      setNewTask({
        title: '',
        description: '',
        status: 'upcoming' as 'upcoming' | 'in-progress' | 'completed',
        dueDate: new Date().toISOString().substring(0, 10),
        assignedTo: [],
        priority: 'medium' as 'high' | 'medium' | 'low'
      });
      setIsAddTaskDialogOpen(false);
    }
  };

  const handleTaskSubmit = (taskId: string) => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: 'completed' });
    }
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Card className="overflow-hidden shadow-lg">
        <div 
          className="w-full h-48 bg-cover bg-center" 
          style={{backgroundImage: `url(${imageUrl})`}}
        >
          <div className="w-full h-full bg-black/30 flex items-end p-6">
            <div>
              <Badge className={`${categoryColor} mb-2`}>{category}</Badge>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-white/80">{teamName}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Start Date
              </span>
              <span className="font-medium">{startDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> End Date
              </span>
              <span className="font-medium">{endDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-1" /> Team Members
              </span>
              <span className="font-medium">{teamMembers.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center">
                <BarChart4 className="h-4 w-4 mr-1" /> Progress
              </span>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{projectDescription}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                {objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Project Tasks</h3>
            {isManagerOrLeader && (
              <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task for team members to work on.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="task-title" className="text-sm font-medium">
                        Task Title
                      </label>
                      <input
                        id="task-title"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="task-description" className="text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id="task-description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="task-status" className="text-sm font-medium">
                          Status
                        </label>
                        <select
                          id="task-status"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newTask.status}
                          onChange={(e) => setNewTask({
                            ...newTask, 
                            status: e.target.value as 'upcoming' | 'in-progress' | 'completed'
                          })}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="task-priority" className="text-sm font-medium">
                          Priority
                        </label>
                        <select
                          id="task-priority"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newTask.priority}
                          onChange={(e) => setNewTask({
                            ...newTask, 
                            priority: e.target.value as 'high' | 'medium' | 'low'
                          })}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="task-due-date" className="text-sm font-medium">
                        Due Date
                      </label>
                      <input
                        id="task-due-date"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">
                        Assign To
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`member-${member.id}`}
                              checked={newTask.assignedTo.includes(member.name)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewTask({
                                    ...newTask,
                                    assignedTo: [...newTask.assignedTo, member.name]
                                  });
                                } else {
                                  setNewTask({
                                    ...newTask,
                                    assignedTo: newTask.assignedTo.filter(name => name !== member.name)
                                  });
                                }
                              }}
                            />
                            <label htmlFor={`member-${member.id}`} className="text-sm">
                              {member.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={handleAddTask}>
                      Create Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1">
                      <Clock className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {task.assignedTo.map((person, idx) => (
                      <Badge key={idx} variant="outline" className="bg-gray-50">
                        {person}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                {user?.role === 'team' && task.status !== 'completed' && (
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleTaskSubmit(task.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Resources</CardTitle>
              <CardDescription>Important links and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index} className="flex items-center p-2 border-b">
                    <Link2 className="h-4 w-4 mr-2 text-primary" />
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProjectDetails;