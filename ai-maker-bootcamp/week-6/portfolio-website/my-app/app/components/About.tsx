import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          A Bit About Me
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              I'm a student at the <span className="font-semibold text-purple-600">AI Maker Bootcamp</span>, 
              where I'm learning to harness the power of artificial intelligence to transform how we work.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              My work focuses on using AI to find improved ways of working—identifying inefficiencies, 
              automating repetitive tasks, and creating intelligent systems that adapt to user needs.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              I believe in data-driven design and performance optimization. Every project I work on 
              is backed by metrics, user research, and continuous iteration.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
            >
              More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-400 via-blue-400 to-purple-600 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-2xl font-bold">AI-Driven</div>
                  <div className="text-xl mt-2">Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

