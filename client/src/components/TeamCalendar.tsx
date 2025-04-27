import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/hooks/useAuth';
import { fadeInUp } from '@/lib/animations';

interface Task {
  id: string;
  title: string;
  date: Date;
  status: 'completed' | 'in-progress' | 'upcoming';
  assignedTo: string[];
  description: string;
}

interface TeamCalendarProps {
  tasks?: Task[];
}

const TeamCalendar: React.FC<TeamCalendarProps> = ({ tasks: propTasks }) => {
  const { getTasksForUser } = useData();
  const { user } = useAuth();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Convert tasks from DataContext to the format needed for the calendar
  const transformTasks = () => {
    if (propTasks) return propTasks;
    
    if (!user) return [];
    
    const userTasks = getTasksForUser(user.email);
    
    return userTasks.map(task => ({
      id: task.id,
      title: task.title,
      date: parseISO(task.dueDate),
      status: task.status as 'completed' | 'in-progress' | 'upcoming',
      assignedTo: task.assignedTo.map(member => member.name),
      description: task.description
    }));
  };
  
  const tasks = transformTasks();
  
  // Get days for the current month view
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });
  
  // Handle month navigation
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  // Check if a day has any tasks
  const isDayWithTask = (day: Date) => {
    return tasks.some(task => isSameDay(parseISO(task.date.toString()), day));
  };
  
  // Get styling for days with tasks
  const dayWithTaskStyle = (day: Date): string => {
    const dayTasks = tasks.filter(task => isSameDay(parseISO(task.date.toString()), day));
    
    if (dayTasks.length === 0) return '';
    
    // Check if all tasks for the day are completed
    const allCompleted = dayTasks.every(task => task.status === 'completed');
    
    // Check if any task for the day is in progress
    const anyInProgress = dayTasks.some(task => task.status === 'in-progress');
    
    if (allCompleted) return 'bg-green-100 text-green-900 font-semibold';
    if (anyInProgress) return 'bg-yellow-100 text-yellow-900 font-semibold';
    return 'bg-blue-100 text-blue-900 font-semibold';
  };
  
  // Get tasks for selected date
  const getTasksForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return tasks.filter(task => isSameDay(parseISO(task.date.toString()), selectedDate));
  };
  
  // Get styling for task status
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'upcoming':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };
  
  // Selected day tasks
  const selectedDayTasks = getTasksForSelectedDate();
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Team Calendar
            </CardTitle>
            <div className="flex space-x-1">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 font-medium">
                {format(currentDate, 'MMMM yyyy')}
              </div>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Names */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="h-8 flex justify-center items-center text-sm font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {daysInMonth.map((day, i) => {
              // Get the day's position in the grid
              const dayOfWeek = day.getDay();
              
              // Calculate margin for first week
              const marginLeft = i === 0 ? `col-start-${dayOfWeek + 1}` : '';
              
              return (
                <button
                  key={day.toISOString()}
                  className={`h-12 rounded-md flex flex-col justify-center items-center text-sm relative
                    ${isToday(day) ? 'border-2 border-primary' : 'border border-gray-200'}
                    ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-primary' : ''}
                    ${dayWithTaskStyle(day)}
                    ${marginLeft}
                    hover:bg-muted transition-colors
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <span>{format(day, 'd')}</span>
                  {isDayWithTask(day) && (
                    <span className="absolute bottom-1 w-4 h-1 rounded-full bg-primary opacity-70"></span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Day Tasks */}
      {selectedDate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayTasks.length > 0 ? (
              <div className="space-y-2">
                {selectedDayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border rounded-md flex items-start gap-3"
                  >
                    {getStatusIcon(task.status)}
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        {task.assignedTo.map((person, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-50">
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No tasks scheduled for this day
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default TeamCalendar;