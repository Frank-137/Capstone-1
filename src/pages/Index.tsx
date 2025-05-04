import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NavBar from '@/components/NavBar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <div className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Hero background with animated globe effect */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-800/30 rounded-full blur-xl animate-spin-slow"></div>
        </div>
        
        {/* Hero content */}
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-blue-100 to-blue-500 bg-clip-text text-transparent">
                Globes of History Unveiled
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100/80">
              Explore the pivotal events of World Wars through an interactive 3D globe experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/explore">
                  Explore Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive 3D Globe</h3>
              <p className="text-foreground/70">
                Navigate a beautifully rendered 3D globe to explore historical events across the world.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Timeline Navigation</h3>
              <p className="text-foreground/70">
                Travel through time with an interactive timeline to witness how world events unfolded chronologically.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl transition-transform duration-300 hover:scale-105">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-900/50 rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Event Relationships</h3>
              <p className="text-foreground/70">
                Visualize the connections between historical events with interactive relationship graphs.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-12 bg-accent/30">
        <div className="container mx-auto px-4">
          <blockquote className="max-w-4xl mx-auto text-center">
            <p className="text-2xl italic mb-4">
              "Those who cannot remember the past are condemned to repeat it."
            </p>
            <footer className="text-lg font-medium">— George Santayana</footer>
          </blockquote>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Explore World History?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/70">
            Dive into our interactive 3D globe and discover the complex web of events that shaped modern history.
          </p>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/explore">Start Exploring</Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 Globes of History. Educational platform for interactive historical exploration.</p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">Home</Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">About</Link>
              <span className="mx-2">•</span>
              <Link to="/about#contact" className="underline hover:text-foreground/80">Contact</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
