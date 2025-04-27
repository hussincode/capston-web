import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Role-specific dashboard content
  const DashboardContent = () => {
    switch (user.role) {
      case "manager":
        return <ManagerDashboard />;
      case "leader":
        return <LeaderDashboard />;
      case "team":
        return <TeamMemberDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onOpenLoginModal={() => {}} />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">
                Welcome, <span className="text-primary">{user.email.split('@')[0]}</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                {user.role === "manager" 
                  ? "Manage capstone projects and oversee team progress"
                  : user.role === "leader"
                    ? "Lead your team and track project milestones"
                    : "Collaborate with your team and contribute to your capstone project"
                }
              </p>
            </motion.div>
          </div>
          
          <DashboardContent />
        </div>
      </main>
    </div>
  );
};

// Simplified role-specific dashboard components
const ManagerDashboard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Active Projects" 
          value="24" 
          description="Total ongoing capstone projects"
          icon="ri-folder-chart-line"
          color="bg-primary"
        />
        <StatsCard 
          title="Teams" 
          value="32" 
          description="Student teams working on projects"
          icon="ri-team-line"
          color="bg-accent"
        />
        <StatsCard 
          title="Faculty Mentors" 
          value="18" 
          description="Assigned to guide teams"
          icon="ri-user-star-line"
          color="bg-secondary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
          <CardDescription>Monitor and manage all capstone projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-lg">Project {item}</h3>
                  <p className="text-sm text-muted-foreground">Team {String.fromCharCode(64 + item)}</p>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                      In Progress
                    </span>
                    <span className="text-sm">65% Complete</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline">View All Projects</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Important dates for project milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { date: "June 15", title: "Midterm Reviews", team: "All Teams" },
                { date: "June 30", title: "Progress Report", team: "Team Alpha" },
                { date: "July 10", title: "Technical Documentation", team: "Team Nexus" }
              ].map((item, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.team}</p>
                  </div>
                  <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                    {item.date}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from all teams</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { time: "2 hours ago", action: "Submitted milestone", team: "Team Verde" },
                { time: "5 hours ago", action: "Updated documentation", team: "Team Alpha" },
                { time: "Yesterday", action: "Requested mentor meeting", team: "Team Nexus" },
                { time: "2 days ago", action: "Completed prototype", team: "Team Innovate" }
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-4 border-b pb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <i className="ri-time-line text-gray-500"></i>
                  </div>
                  <div>
                    <p className="font-medium">{item.team} {item.action}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LeaderDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Your Project" 
          value="1" 
          description="Smart Home Automation"
          icon="ri-folder-chart-line"
          color="bg-primary"
        />
        <StatsCard 
          title="Team Members" 
          value="5" 
          description="Currently active contributors"
          icon="ri-team-line"
          color="bg-accent"
        />
        <StatsCard 
          title="Upcoming Milestone" 
          value="Jun 15" 
          description="Midterm presentation"
          icon="ri-calendar-check-line"
          color="bg-secondary"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks & Milestones</CardTitle>
          <CardDescription>Manage your team's tasks and track progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { title: "Initial prototype", status: "completed", assigned: "Team", dueDate: "May 20" },
              { title: "User testing", status: "in-progress", assigned: "Sarah, David", dueDate: "June 10" },
              { title: "Documentation", status: "in-progress", assigned: "Maya", dueDate: "June 15" },
              { title: "Final presentation", status: "pending", assigned: "All team", dueDate: "July 30" }
            ].map((task, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === "completed" ? "bg-green-500" : 
                    task.status === "in-progress" ? "bg-amber-500" : "bg-gray-300"
                  }`}></div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Assigned to: {task.assigned}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  Due: {task.dueDate}
                </div>
              </div>
            ))}
            <Button className="mt-4">
              <i className="ri-add-line mr-2"></i> Add New Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const TeamMemberDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Your Project" 
          value="1" 
          description="AI Learning Assistant"
          icon="ri-folder-chart-line"
          color="bg-accent"
        />
        <StatsCard 
          title="Assigned Tasks" 
          value="3" 
          description="2 in progress, 1 completed"
          icon="ri-task-line"
          color="bg-primary"
        />
        <StatsCard 
          title="Next Deadline" 
          value="Jun 10" 
          description="User testing completion"
          icon="ri-calendar-check-line"
          color="bg-secondary"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Project</CardTitle>
            <CardDescription>You're a member of Team Nexus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg">AI Learning Assistant</h3>
              <p className="text-sm text-muted-foreground mt-1">A smart learning platform that adapts to student needs</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">AI</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">EdTech</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Machine Learning</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-lg mb-2">Team Members</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {[
                  { name: "Alex Chen", role: "Team Leader", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
                  { name: "You", role: "Developer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
                  { name: "Michael Brown", role: "UI Designer", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" },
                  { name: "Priya Sharma", role: "Data Scientist", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" }
                ].map((member, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className={`text-sm ${member.name === "You" ? "font-bold" : ""}`}>{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {[
                { title: "Implement login functionality", status: "In Progress", priority: "High", dueDate: "Jun 10" },
                { title: "Fix responsiveness issues", status: "In Progress", priority: "Medium", dueDate: "Jun 12" },
                { title: "Add unit tests", status: "Completed", priority: "Medium", dueDate: "Jun 5" },
              ].map((task, index) => (
                <li key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      task.status === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : task.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Priority: {task.priority}</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
          <CardDescription>Key milestones and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <ul className="space-y-6 relative">
              {[
                { date: "May 15", title: "Project Kickoff", status: "Completed" },
                { date: "June 1", title: "First Prototype", status: "Completed" },
                { date: "June 15", title: "Midterm Review", status: "Upcoming" },
                { date: "July 10", title: "User Testing", status: "Planned" },
                { date: "August 1", title: "Final Presentation", status: "Planned" }
              ].map((milestone, index) => (
                <li key={index} className="ml-8 relative">
                  <div className={`absolute -left-10 w-6 h-6 rounded-full border-2 ${
                    milestone.status === "Completed" 
                      ? "bg-green-100 border-green-500" 
                      : milestone.status === "Upcoming"
                        ? "bg-amber-100 border-amber-500"
                        : "bg-white border-gray-300"
                  } flex items-center justify-center`}>
                    {milestone.status === "Completed" && (
                      <i className="ri-check-line text-green-500 text-sm"></i>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DefaultDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h2 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h2>
      <p className="text-muted-foreground">Your role-specific content will appear here.</p>
    </div>
  );
};

// Reusable stats card component
const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  color = "bg-primary" 
}: { 
  title: string; 
  value: string; 
  description: string;
  icon: string;
  color?: string;
}) => {
  return (
    <Card>
      <CardContent className="flex p-6">
        <div className={`${color} bg-opacity-10 p-4 rounded-full mr-4`}>
          <i className={`${icon} text-2xl ${color.replace('bg-', 'text-')}`}></i>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;