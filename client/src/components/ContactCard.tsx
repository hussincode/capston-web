import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ContactCardProps {
  icon: string;
  title: string;
  content: string;
  index: number;
}

const ContactCard = ({ icon, title, content, index }: ContactCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card-hover"
    >
      <Card className="bg-white p-8 rounded-xl shadow-lg text-center h-full">
        <CardContent className="p-0">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <i className={`${icon} text-2xl text-primary`}></i>
          </div>
          <h3 className="font-heading font-semibold text-xl mb-2">{title}</h3>
          <p className="text-muted-foreground">{content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactCard;
