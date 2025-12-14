"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 dark:bg-black/80 dark:border-zinc-800">
      <div className={`${isDashboard ? 'w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              Notes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links - Show Features & FAQ on landing page */}
            {!isDashboard && (
              <>
                <Link
                  href="#features"
                  className="text-white dark:text-white font-bold transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#faq"
                  className="text-white dark:text-white font-bold transition-colors"
                >
                  FAQ
                </Link>
              </>
            )}

            {/* Auth Buttons */}
            <SignedOut>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors font-medium"
              >
                Sign In
              </Link>
            </SignedOut>
            
            <SignedIn>
              <div className="flex items-center gap-6">
                {!isDashboard && (
                  <Link
                    href="/dashboard"
                    className="text-white dark:text-white font-bold transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all",
                      userButtonPopoverCard: "shadow-2xl",
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-zinc-900 dark:text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-zinc-200 dark:border-zinc-800">
            {/* Show Features & FAQ on landing page */}
            {!isDashboard && (
              <>
                <Link
                  href="#features"
                  className="block px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="#faq"
                  className="block px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
              </>
            )}

            <SignedIn>
              {!isDashboard && (
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </SignedIn>
            
            <SignedOut>
              <Link
                href="/sign-in"
                className="block px-4 py-2 bg-zinc-900 text-white text-center rounded-lg hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            </SignedOut>
            
            <SignedIn>
              <div className="px-4 py-2 flex items-center gap-3 border-t border-zinc-200 dark:border-zinc-800 pt-4 mt-4">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                  afterSignOutUrl="/"
                />
                <span className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Your Account</span>
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </nav>
  );
}
