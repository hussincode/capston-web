import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatarUrl: string;
  index: number;
}

const TestimonialCard = ({ 
  quote, 
  name, 
  role, 
  avatarUrl,
  index
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="p-8 shadow-lg relative h-full">
        <div className="absolute -top-5 left-8 text-5xl text-primary opacity-20">"</div>
        <CardContent className="p-0 relative">
          <p className="text-foreground mb-6 italic">{quote}</p>
          
          <div className="flex items-center">
            <img 
              src={avatarUrl} 
              className="w-12 h-12 rounded-full mr-4 object-cover" 
              alt={`${name}'s portrait`}
            />
            <div>
              <h4 className="font-semibold">{name}</h4>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
