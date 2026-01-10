import Link from 'next/link';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="py-24 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Ready to work together?
        </h2>
        <div className="flex flex-col items-center gap-6 mb-12">
          <Link
            href="mailto:mishal@example.com"
            className="inline-flex items-center gap-2 text-xl text-purple-400 hover:text-purple-300 transition-colors font-medium"
          >
            <Mail className="w-6 h-6" />
            mishal@example.com
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </Link>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 text-gray-400">
          <p>&copy; {new Date().getFullYear()} Mishal Hasan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

