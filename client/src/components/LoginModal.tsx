import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    
    login(email, selectedRole);
    onClose();
  };
  
  // Animation variants for role cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Role selection cards
  const RoleCard = ({ role, title, description, icon }: { role: string; title: string; description: string; icon: React.ReactNode }) => (
    <motion.div
      variants={itemVariants}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedRole === role
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted'
      }`}
      onClick={() => setSelectedRole(role)}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${
          selectedRole === role ? 'bg-primary text-white' : 'bg-muted'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="ml-auto">
          <div className={`w-4 h-4 rounded-full border ${
            selectedRole === role
              ? 'border-primary bg-primary'
              : 'border-gray-300'
          }`}>
            {selectedRole === role && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome to Elsewedy School</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access the capstone project platform
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">
              Select Your Role
            </label>
            <motion.div
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <RoleCard
                role="manager"
                title="Manager"
                description="Can create projects and assign tasks"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                }
              />
              
              <RoleCard
                role="leader"
                title="Leader"
                description="Can create tasks and manage team members"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                }
              />
              
              <RoleCard
                role="team"
                title="Team Leader"
                description="Can submit tasks and view notifications"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                    <path d="m16 11 2 2 4-4"></path>
                  </svg>
                }
              />
            </motion.div>
          </div>
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;