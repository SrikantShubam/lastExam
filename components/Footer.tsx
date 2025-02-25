// import { FaReddit, FaTwitter, FaLinkedin } from "react-icons/fa";
// import Link from "next/link";

// export default function Footer() {
//   return (
//     <footer className="p-6 border-t text-center mt-4 bg-background text-foreground">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
//         {/* Disclaimer */}
//         <p className="text-sm max-w-2xl text-center md:text-left">
//           <strong>Disclaimer:</strong> We are not responsible for any discrepancies about any data presented here. Aspirants are requested to always cross-check with official resources.
//         </p>

//         {/* Social Media Links */}
//         <div className="flex gap-4 mt-4 md:mt-0">
//           <Link href="https://www.reddit.com/r/examrepo" target="_blank" className="hover:text-red-500">
//             <FaReddit size={24} />
//           </Link>
//           <Link href="https://twitter.com/examrepo" target="_blank" className="hover:text-blue-400">
//             <FaTwitter size={24} />
//           </Link>
//           <Link href="https://www.linkedin.com/company/examrepo" target="_blank" className="hover:text-blue-600">
//             <FaLinkedin size={24} />
//           </Link>
//         </div>
//       </div>
//       <p className="text-xs mt-4">&copy; 2025 ExamRepo. All rights reserved.</p>
//     </footer>
//   );
// }
import { FaReddit, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-black dark:border-white bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Disclaimer */}
        <p className="text-sm sm:text-base font-medium text-center md:text-left max-w-2xl leading-tight opacity-80">
          <span className="font-bold">Disclaimer:</span> We’re not liable for data discrepancies. Always verify with official sources.
        </p>

        {/* Social Media Links */}
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
      </div>

      {/* Copyright */}
      <p className="text-xs sm:text-sm font-semibold text-center mt-6 opacity-60">
        © {new Date().getFullYear()} ExamRepo. All Rights Reserved.
      </p>
    </footer>
  );
}