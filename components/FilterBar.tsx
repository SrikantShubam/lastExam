// "use client";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { motion } from "framer-motion";

// export default function FilterBar({ filters, setFilters }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//       className="flex flex-col sm:flex-row gap-4 mb-8"
//     >
//       <Select value={filters.subject} onValueChange={(value) => setFilters({ ...filters, subject: value })}>
//         <SelectTrigger className="w-full sm:w-48 border-black dark:border-white text-black dark:text-white">
//           <SelectValue placeholder="Filter by Subject" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">All Subjects</SelectItem>
//           <SelectItem value="English">English</SelectItem>
//           <SelectItem value="Math">Math</SelectItem>
//           <SelectItem value="General Ability">General Ability</SelectItem>
//         </SelectContent>
//       </Select>
//       <Select value={filters.grade} onValueChange={(value) => setFilters({ ...filters, grade: value })}>
//         <SelectTrigger className="w-full sm:w-48 border-black dark:border-white text-black dark:text-white">
//           <SelectValue placeholder="Filter by Grade" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">All Grades</SelectItem>
//           <SelectItem value="10">Grade 10</SelectItem>
//           <SelectItem value="11">Grade 11</SelectItem>
//           <SelectItem value="12">Grade 12</SelectItem>
//         </SelectContent>
//       </Select>
//     </motion.div>
//   );
// }
// components/FilterBar.jsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function FilterBar({ filters, setFilters }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="flex flex-col sm:flex-row gap-4 mb-8"
    >
      <Select
        value={filters.subject}
        onValueChange={(value) => setFilters({ ...filters, subject: value })}
      >
        <SelectTrigger className="w-full sm:w-48 border-black dark:border-white text-black dark:text-white">
          <SelectValue placeholder="Filter by Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          <SelectItem value="English">English</SelectItem>
          <SelectItem value="Math">Math</SelectItem>
 softer <SelectItem value="General Ability">General Ability</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.grade}
        onValueChange={(value) => setFilters({ ...filters, grade: value })}
      >
        <SelectTrigger className="w-full sm:w-48 border-black dark:border-white text-black dark:text-white">
          <SelectValue placeholder="Filter by Grade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Grades</SelectItem>
          <SelectItem value="10">Grade 10</SelectItem>
          <SelectItem value="11">Grade 11</SelectItem>
          <SelectItem value="12">Grade 12</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}