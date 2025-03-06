 "use client";
import { FaReddit, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-black dark:border-white bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* Simplified Background Elements - pure black/white only */}
      <div className="absolute inset-0 z-0">
        {/* Simple gradient - no color hue */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/5 to-transparent dark:from-white/5 dark:to-transparent" />
      </div>
      
      {/* Simple dot pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+')]" />
      </div>
      
      {/* Subtle line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-black/10 dark:bg-white/10" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Disclaimer */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base font-medium text-center md:text-left max-w-xl"
          >
            <p className="leading-relaxed">
              <span className="font-bold">Disclaimer:</span> We're not liable for data discrepancies. Always verify with official sources.
            </p>
          </motion.div>
          
          {/* Contact & Social Media Links */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-end gap-4"
          >
            {/* Email Address - simplified */}
            <Link
              href="mailto:agency10169@gmail.com"
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            >
              <FaEnvelope size={16} />
              <span>agency10169@gmail.com</span>
            </Link>
            
            {/* Social Media Icons */}
            <div className="flex gap-6">
              <Link
                href="https://www.reddit.com/r/examrepo"
                target="_blank"
                className="text-black dark:text-white hover:opacity-70 transition-opacity"
              >
                <FaReddit size={28} />
              </Link>
              <Link
                href="https://twitter.com/examrepo"
                target="_blank"
                className="text-black dark:text-white hover:opacity-70 transition-opacity"
              >
                <FaTwitter size={28} />
              </Link>
              <Link
                href="https://www.linkedin.com/company/examrepo"
                target="_blank"
                className="text-black dark:text-white hover:opacity-70 transition-opacity"
              >
                <FaLinkedin size={28} />
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Simple divider */}
        <div className="w-full h-px bg-black/10 dark:bg-white/10 my-6" />
        
        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-xs sm:text-sm font-medium">
            © {new Date().getFullYear()} ExamRepo. All Rights Reserved.
          </p>
          
          <div className="text-xs opacity-60 mt-2 sm:mt-0">
            <span>Designed with precision</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}