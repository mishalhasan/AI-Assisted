import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedProjects from './components/FeaturedProjects';
import About from './components/About';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedProjects />
      <About />
      <Footer />
    </main>
  );
}
