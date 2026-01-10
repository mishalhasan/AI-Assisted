import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Hi, I'm an{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            AI Performance
          </span>{' '}
          Designer
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Based in <span className="font-semibold text-gray-900">San Francisco</span>. Creating{' '}
          <span className="font-semibold text-purple-600">AI-driven solutions</span> that optimize workflows and enhance productivity.
        </p>
        <Link
          href="#work"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          See My Work
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

