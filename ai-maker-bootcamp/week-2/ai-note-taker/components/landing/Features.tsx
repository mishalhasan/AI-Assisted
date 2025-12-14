export default function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Intelligence",
      description: "Smart suggestions and auto-completion help you write faster and organize better.",
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Instant sync across all devices. Your notes are always up-to-date, everywhere.",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "End-to-end encryption ensures your notes stay private and secure.",
    },
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Clean, intuitive interface that gets out of your way and lets you focus.",
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Works seamlessly on desktop, tablet, and mobile devices.",
    },
    {
      icon: "🔍",
      title: "Smart Search",
      description: "Find anything instantly with powerful AI-powered search capabilities.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}take better notes
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Powerful features designed to make note-taking effortless and enjoyable.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional feature highlight */}
        <div className="mt-20 p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                AI That Understands You
              </h3>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
                Our advanced AI learns from your writing style and helps you capture ideas more effectively. Get smart suggestions, automatic categorization, and intelligent summaries.
              </p>
              <ul className="space-y-3">
                {[
                  "Auto-complete sentences",
                  "Smart tagging and organization",
                  "Generate summaries instantly",
                  "Extract action items automatically",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-10 dark:opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl">📝</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

