import { motion } from "framer-motion";

interface RoleCardProps {
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const RoleCard = ({ icon, label, isSelected, onClick }: RoleCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`role-card bg-white border-2 ${
        isSelected 
          ? "border-primary bg-primary/5" 
          : "border-gray-200 hover:border-primary"
      } rounded-xl p-4 text-center cursor-pointer transition-all`}
      role="button"
      tabIndex={0}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
        <i className={`${icon} text-xl text-primary`}></i>
      </div>
      <p className="text-sm font-medium">{label}</p>
    </motion.div>
  );
};

export default RoleCard;
