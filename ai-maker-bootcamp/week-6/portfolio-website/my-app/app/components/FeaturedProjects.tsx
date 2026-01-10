import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Workflow Optimizer',
    description: 'Automated workflow analysis using machine learning to identify bottlenecks and suggest improvements.',
    image: '/api/placeholder/600/400',
  },
  {
    id: 2,
    title: 'Performance Analytics Dashboard',
    description: 'Real-time data visualization platform for tracking team productivity and AI model performance.',
    image: '/api/placeholder/600/400',
  },
  {
    id: 3,
    title: 'Smart Task Automation',
    description: 'Intelligent task routing system that learns from user behavior to optimize task distribution.',
    image: '/api/placeholder/600/400',
  },
];

export default function FeaturedProjects() {
  return (
    <section id="work" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl"
            >
              <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-purple-200 opacity-50">
                    {project.id}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors group"
          >
            View All Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

