import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Globe2, ListChecks, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';

const Index = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleExploreClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 animate-gradient-x bg-gradient-to-br from-blue-900 via-pink-700 to-yellow-400 opacity-30 blur-2xl" />
      <NavBar />
      
      <div className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Hero background with animated globe effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-blue-800/30 rounded-full blur-xl animate-spin-slow"></div>
        </div>
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Sparkles className="w-32 h-32 text-yellow-300 animate-bounce" />
          </div>
        )}
        {/* Hero content */}
        <div className="container mx-auto px-2 sm:px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-300 bg-clip-text text-transparent animate-gradient-x">
              HistoriScope 3D <span className="inline-block align-middle"></span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 text-blue-100/80">
              Explore the pivotal events of World Wars through an interactive 3D globe experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-pink-500 w-full sm:w-auto transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-2xl" onClick={handleExploreClick}>
                <Link to="/explore">
                  <span className="flex items-center gap-2">Explore Now <ArrowRight className="ml-2 h-5 w-5 animate-bounce-x" /></span>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto transition-transform duration-200 hover:scale-105">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent animate-gradient-x">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4 group-hover:bg-pink-500/60 transition-colors">
                <Globe2 className="h-7 w-7 text-blue-300 group-hover:text-yellow-200 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Interactive 3D Globe <span className="bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full ml-1 animate-pulse">WOW</span></h3>
              <p className="text-foreground/70">
                Navigate a beautifully rendered 3D globe to explore historical events across the world.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4 group-hover:bg-yellow-400/60 transition-colors">
                <ListChecks className="h-7 w-7 text-pink-300 group-hover:text-blue-900 animate-wiggle" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Timeline Navigation <span className="bg-pink-300 text-pink-900 text-xs font-bold px-2 py-1 rounded-full ml-1 animate-pulse">NEW</span></h3>
              <p className="text-foreground/70">
                Travel through time with an interactive timeline to witness how world events unfolded chronologically.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4 group-hover:bg-blue-400/60 transition-colors">
                <Share2 className="h-7 w-7 text-yellow-300 group-hover:text-pink-300 animate-wiggle" />
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Event Relationships <span className="bg-blue-300 text-blue-900 text-xs font-bold px-2 py-1 rounded-full ml-1 animate-pulse">FUN</span></h3>
              <p className="text-foreground/70">
                Visualize the connections between historical events with interactive relationship graphs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-2 sm:px-4">
          <blockquote className="max-w-4xl mx-auto text-center">
            <p className="text-2xl italic mb-4 animate-gradient-x bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent">
              "Those who cannot remember the past are condemned to repeat it."
            </p>
            <footer className="text-lg font-medium text-blue-200 flex items-center justify-center gap-2">
              — George Santayana
            </footer>
          </blockquote>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">Ready to Explore World History?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
            Dive into our interactive 3D globe and discover the complex web of events that shaped modern history.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-pink-500 w-full sm:w-auto transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-2xl animate-bounce-x">
            <Link to="/explore">Start Exploring</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 HistoriScope 3D. Educational platform for interactive historical exploration.</p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">Home</Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">About</Link>
              <span className="mx-2">•</span>
              <a href="/about#contact" className="underline hover:text-foreground/80">Contact</a>
            </p>
          </div>
        </div>
      </footer>
      {/* Keyframes for playful animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.2s infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;