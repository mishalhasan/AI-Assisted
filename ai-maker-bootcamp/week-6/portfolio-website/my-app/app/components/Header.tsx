import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-purple-600 group-hover:text-purple-700 transition-colors" />
          <span className="text-xl font-bold text-gray-900">MH</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link 
            href="#work" 
            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
          >
            Work
          </Link>
          <Link 
            href="#about" 
            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}

