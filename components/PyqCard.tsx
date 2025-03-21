// components/PyqCard.jsx
import Link from "next/link";
import { motion } from "framer-motion";

export default function PyqCard({ pyq }) {
  return (
    <Link href={`/pyqs/${pyq.exam}/${pyq.paperName}`}>
      <motion.div
        whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        whileTap={{ scale: 0.98 }}
        className="p-6 border border-black/20 dark:border-white/20 rounded-lg bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-white/10 transition-colors"
      >
        <h3 className="text-xl font-semibold text-black dark:text-white">{pyq.paperName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Exam: {pyq.exam}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Subjects: {pyq.subjects.join(", ")}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Type: {pyq.type}</p>
        {pyq.grade !== "N/A" && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Grade: {pyq.grade}</p>
        )}
      </motion.div>
    </Link>
  );
}