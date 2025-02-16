import { FaReddit, FaTwitter, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-6 border-t text-center mt-4 bg-background text-foreground">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Disclaimer */}
        <p className="text-sm max-w-2xl text-center md:text-left">
          <strong>Disclaimer:</strong> We are not responsible for any discrepancies about any data presented here. Aspirants are requested to always cross-check with official resources.
        </p>

        {/* Social Media Links */}
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="https://www.reddit.com/r/examrepo" target="_blank" className="hover:text-red-500">
            <FaReddit size={24} />
          </Link>
          <Link href="https://twitter.com/examrepo" target="_blank" className="hover:text-blue-400">
            <FaTwitter size={24} />
          </Link>
          <Link href="https://www.linkedin.com/company/examrepo" target="_blank" className="hover:text-blue-600">
            <FaLinkedin size={24} />
          </Link>
        </div>
      </div>
      <p className="text-xs mt-4">&copy; 2025 ExamRepo. All rights reserved.</p>
    </footer>
  );
}