import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 -z-10" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-[blob_7s_infinite]" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-[blob_7s_infinite_2s]" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 animate-[blob_7s_infinite_4s]" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm rounded-full border border-zinc-200 dark:border-zinc-800 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              AI-Powered Note Taking
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
            Simplify Learning,
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Work Faster
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the AI note-taking revolution. Capture ideas, organize thoughts, and boost productivity with intelligent assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-900 dark:text-white rounded-xl hover:bg-white dark:hover:bg-zinc-900 transition-all font-semibold text-lg border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Learn More
            </Link>
          </div>

          {/* Stats or social proof */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">10K+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">50K+</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Notes Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-zinc-900 dark:text-white">99%</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

