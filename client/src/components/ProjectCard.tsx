import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { cardHover } from '@/lib/animations';
import { useLocation } from 'wouter';

export interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  tags: string[];
  teamName: string;
  teamMembers: {
    id: string;
    avatarUrl: string;
  }[];
  imageUrl: string;
}

const ProjectCard = ({
  id,
  title,
  description,
  category,
  categoryColor,
  tags,
  teamName,
  teamMembers,
  imageUrl,
}: ProjectCardProps) => {
  const [, navigate] = useLocation();
  
  const handleViewProject = () => {
    navigate(`/projects/${id}`);
  };
  
  return (
    <motion.div 
      className="h-full"
      whileHover={cardHover}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-4">
            <Badge className={`${categoryColor} mb-2`}>{category}</Badge>
            <h3 className="text-lg font-bold text-white truncate">{title}</h3>
            <p className="text-white/80 text-sm truncate">{teamName}</p>
          </div>
        </div>
        
        <CardContent className="py-4 flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">{description}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 pb-4 flex justify-between items-center">
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 3).map((member) => (
              <img 
                key={member.id}
                src={member.avatarUrl}
                alt="Team member"
                className="w-8 h-8 rounded-full border-2 border-background object-cover"
              />
            ))}
            {teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                +{teamMembers.length - 3}
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={handleViewProject}
          >
            Details
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;