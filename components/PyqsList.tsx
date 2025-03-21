// components/PyqsList.jsx
import PyqCard from "../components/PyqCard";
import { motion } from "framer-motion";

export default function PyqsList({ pyqs }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {pyqs.map((pyq, index) => (
        <PyqCard key={index} pyq={pyq} />
      ))}
    </motion.div>
  );
}