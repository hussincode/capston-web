import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  X,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fadeInUp } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  taskId?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onViewTask?: (taskId: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
  onViewTask
}) => {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
  
  const unreadNotifications = notifications.filter(notif => !notif.isRead);
  
  useEffect(() => {
    // Show toast when a new notification arrives
    const latestUnread = unreadNotifications[0];
    if (latestUnread && latestUnread !== latestNotification) {
      setLatestNotification(latestUnread);
      setShowToast(true);
      
      // Hide toast after 5 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, latestNotification]);
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000; // difference in seconds
    
    if (diff < 60) {
      return 'just now';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <>
      {/* Notification Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadNotifications.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex justify-between items-center">
            <span>Notifications</span>
            {unreadNotifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7"
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <DropdownMenuGroup>
                {notifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    <DropdownMenuItem 
                      className={`flex items-start gap-2 p-3 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-muted-foreground text-xs mt-1">{notification.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.timestamp)}
                          </span>
                          {notification.taskId && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={() => onViewTask && onViewTask(notification.taskId!)}
                            >
                              View Task
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 absolute top-1 right-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                ))}
              </DropdownMenuGroup>
            ) : (
              <div className="py-6 text-center">
                <Bell className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && latestNotification && (
          <motion.div
            className="fixed bottom-4 right-4 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50 border"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex p-4">
              <div className="flex-shrink-0 mr-3">
                {getNotificationIcon(latestNotification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{latestNotification.title}</p>
                <p className="text-sm text-gray-500 mt-1">{latestNotification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={() => setShowToast(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-between">
              <span className="text-xs text-gray-500">
                {formatTime(latestNotification.timestamp)}
              </span>
              <div className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => {
                    onMarkAsRead(latestNotification.id);
                    setShowToast(false);
                  }}
                >
                  Mark as read
                </Button>
                {latestNotification.taskId && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => {
                      onViewTask && onViewTask(latestNotification.taskId!);
                      setShowToast(false);
                    }}
                  >
                    View Task
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;