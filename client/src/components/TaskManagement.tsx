import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  Bell,
  Users
} from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { fadeInUp } from '@/lib/animations';

// Types for task management
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

interface Task {
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

interface Notification {
  id: string;
  taskId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface TaskManagementProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  onTaskAdd?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete?: (taskId: string) => void;
  onNotificationAdd?: (notification: Omit<Notification, 'id'>) => void;
  onNotificationMarkAsRead?: (notificationId: string) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({
  teamMembers,
  tasks,
  onTaskAdd,
  onTaskUpdate,
  onTaskDelete,
  onNotificationAdd,
  onNotificationMarkAsRead
}) => {
  const { user } = useAuth();
  const isManagerOrLeader = user?.role === 'manager' || user?.role === 'leader';
  const isTeamMember = user?.role === 'team';
  
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: [],
    priority: 'medium',
    createdBy: user?.email || 'Unknown',
    notifications: []
  });
  
  // Filter tasks based on user role
  const filteredTasks = isTeamMember 
    ? tasks.filter(task => task.assignedTo.some(member => member.name === user?.email?.split('@')[0]))
    : tasks;
  
  // Get notifications for the current user
  const userNotifications = tasks
    .flatMap(task => task.notifications || [])
    .filter(notification => {
      const task = tasks.find(t => t.id === notification.taskId);
      return task?.assignedTo.some(member => member.name === user?.email?.split('@')[0]);
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  useEffect(() => {
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId) || null;
      setSelectedTask(task);
      
      if (task) {
        setNewTask({
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
          assignedTo: task.assignedTo,
          priority: task.priority,
          createdBy: task.createdBy,
          notifications: task.notifications
        });
      }
    }
  }, [selectedTaskId, tasks]);
  
  const handleAddTask = () => {
    if (onTaskAdd && newTask.title.trim() !== '') {
      onTaskAdd(newTask);
      
      // Create notifications for assigned team members
      if (onNotificationAdd) {
        newTask.assignedTo.forEach(member => {
          onNotificationAdd({
            taskId: 'new-task-id', // This will be replaced with the actual ID when created
            message: `You have been assigned a new task: ${newTask.title}`,
            timestamp: new Date().toISOString(),
            isRead: false
          });
        });
      }
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
        assignedTo: [],
        priority: 'medium',
        createdBy: user?.email || 'Unknown',
        notifications: []
      });
      
      setIsAddTaskDialogOpen(false);
    }
  };
  
  const handleEditTask = () => {
    if (onTaskUpdate && selectedTaskId && selectedTask) {
      onTaskUpdate(selectedTaskId, newTask);
      
      // Create notifications for newly assigned team members
      if (onNotificationAdd) {
        const originalTask = tasks.find(t => t.id === selectedTaskId);
        const originalAssignees = originalTask?.assignedTo.map(member => member.id) || [];
        const newAssignees = newTask.assignedTo.map(member => member.id);
        
        // Find newly assigned members
        const newlyAssigned = newTask.assignedTo.filter(
          member => !originalAssignees.includes(member.id)
        );
        
        // Notify newly assigned members
        newlyAssigned.forEach(member => {
          onNotificationAdd({
            taskId: selectedTaskId,
            message: `You have been assigned a new task: ${newTask.title}`,
            timestamp: new Date().toISOString(),
            isRead: false
          });
        });
        
        // Notify about status changes
        if (originalTask && originalTask.status !== newTask.status) {
          originalTask.assignedTo.forEach(member => {
            onNotificationAdd({
              taskId: selectedTaskId,
              message: `Task "${newTask.title}" status changed to ${newTask.status}`,
              timestamp: new Date().toISOString(),
              isRead: false
            });
          });
        }
      }
      
      setIsEditTaskDialogOpen(false);
      setSelectedTaskId(null);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
  };
  
  const handleStatusChange = (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
      
      // Add notification
      if (onNotificationAdd) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const statusText = newStatus === 'completed' 
            ? 'marked as completed' 
            : `moved to ${newStatus}`;
          
          task.assignedTo.forEach(member => {
            onNotificationAdd({
              taskId: taskId,
              message: `Task "${task.title}" has been ${statusText}`,
              timestamp: new Date().toISOString(),
              isRead: false
            });
          });
        }
      }
    }
  };
  
  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (onNotificationMarkAsRead) {
      onNotificationMarkAsRead(notificationId);
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Task form content for both add and edit dialogs
  const TaskFormContent = () => (
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
              status: e.target.value as 'pending' | 'in-progress' | 'completed'
            })}
          >
            <option value="pending">Pending</option>
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
        <label className="text-sm font-medium flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Assign To
        </label>
        <div className="grid grid-cols-2 gap-2">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`member-${member.id}`}
                checked={newTask.assignedTo.some(m => m.id === member.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewTask({
                      ...newTask,
                      assignedTo: [...newTask.assignedTo, member]
                    });
                  } else {
                    setNewTask({
                      ...newTask,
                      assignedTo: newTask.assignedTo.filter(m => m.id !== member.id)
                    });
                  }
                }}
              />
              <label htmlFor={`member-${member.id}`} className="text-sm flex items-center">
                <img 
                  src={member.avatarUrl} 
                  alt={member.name}
                  className="h-5 w-5 rounded-full mr-1"
                />
                {member.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const TaskCard = ({ task }: { task: Task }) => {
    const dueDate = new Date(task.dueDate);
    const isPastDue = dueDate < new Date() && task.status !== 'completed';
    
    return (
      <Card className={`shadow-sm ${isPastDue ? 'border-red-300' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg truncate">{task.title}</CardTitle>
            {isManagerOrLeader ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    setSelectedTaskId(task.id);
                    setIsEditTaskDialogOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'pending')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Set as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'in-progress')}>
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    Set as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, 'completed')}>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Set as Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
            )}
          </div>
          <CardDescription>
            <div className="flex items-center gap-2 text-xs">
              <span className={`flex items-center ${getPriorityColor(task.priority)}`}>
                <Clock className="h-3 w-3 mr-1" />
                {task.priority} priority
              </span>
              <span>•</span>
              <span className={`flex items-center ${isPastDue ? 'text-red-500 font-medium' : ''}`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
          <div className="flex -space-x-2">
            {task.assignedTo.slice(0, 3).map((member, index) => (
              <img 
                key={index}
                src={member.avatarUrl}
                alt={member.name}
                title={member.name}
                className="h-6 w-6 rounded-full border-2 border-background"
              />
            ))}
            {task.assignedTo.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{task.assignedTo.length - 3}
              </div>
            )}
          </div>
        </CardContent>
        {isTeamMember && task.status !== 'completed' && (
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleStatusChange(task.id, 'completed')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Management</h2>
        
        {isManagerOrLeader && (
          <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Add a new task and assign it to team members.
                </DialogDescription>
              </DialogHeader>
              
              <TaskFormContent />
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Edit Task Dialog */}
        <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Make changes to the task details.
              </DialogDescription>
            </DialogHeader>
            
            <TaskFormContent />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditTaskDialogOpen(false);
                setSelectedTaskId(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditTask}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Notifications Section for Team Members */}
      {isTeamMember && userNotifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userNotifications.map((notification) => (
                <li 
                  key={notification.id} 
                  className={`p-3 border rounded-lg flex items-start justify-between ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Bell className={`h-5 w-5 flex-shrink-0 ${
                      notification.isRead ? 'text-gray-400' : 'text-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleMarkNotificationAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {pendingTasks.length > 0 && (
              <Badge className="ml-2 bg-blue-500">{pendingTasks.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress
            {inProgressTasks.length > 0 && (
              <Badge className="ml-2 bg-yellow-500">{inProgressTasks.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedTasks.length > 0 && (
              <Badge className="ml-2 bg-green-500">{completedTasks.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground">
                {isManagerOrLeader 
                  ? "Create a new task to get started."
                  : "You don't have any tasks assigned to you."}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          {pendingTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium">No pending tasks</h3>
              <p className="text-muted-foreground">All current tasks are in progress or completed.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress" className="mt-4">
          {inProgressTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium">No tasks in progress</h3>
              <p className="text-muted-foreground">Start working on a task to move it to this section.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {completedTasks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-medium">No completed tasks</h3>
              <p className="text-muted-foreground">Tasks marked as completed will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TaskManagement;