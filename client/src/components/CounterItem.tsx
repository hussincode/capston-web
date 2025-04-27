import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface CounterItemProps {
  end: number;
  suffix?: string;
  label: string;
  color?: string;
  duration?: number;
}

const CounterItem = ({ 
  end, 
  suffix = "", 
  label, 
  color = "text-primary",
  duration = 2 
}: CounterItemProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      
      let startTime: number;
      let animationFrame: number;
      
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };
      
      animationFrame = requestAnimationFrame(step);
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration, hasAnimated]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className={`text-4xl md:text-5xl font-bold ${color} mb-2`}>
        {count}{suffix}
      </div>
      <p className="text-foreground">{label}</p>
    </motion.div>
  );
};

export default CounterItem;
