import { motion } from "framer-motion";

interface FloatingAnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FloatingAnimation = ({ 
  children, 
  delay = 0,
  className = "" 
}: FloatingAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FloatingAnimation;
