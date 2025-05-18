import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';

const About = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = React.useState('features');

  useEffect(() => {
    if (location.hash === '#contact') {
      setActiveTab('members');
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 mt-16 container mx-auto px-2 sm:px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About This Project</h1>
          
          <div className="glass-panel p-6 md:p-8 mb-10">
            <div className="flex items-center gap-3 mb-6 bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
              <GraduationCap className="w-7 h-7 text-blue-400 flex-shrink-0" />
              <span className="text-base md:text-lg font-semibold text-blue-200">
                This project applies concepts from <span className="text-blue-300">CSS291 (Capstone)</span> and <span className="text-blue-300">CSS241 (AI & ML)</span> to create an interactive historical learning platform.
              </span>
            </div>
            
            <p className="text-lg mb-6">
              HistoriScope 3D is an interactive educational platform designed to make learning about World Wars and historical events more engaging and comprehensive through data visualization.
            </p>
            
            <p className="text-lg mb-6">
              Our mission is to increase understanding and interest in studying history through 3D simulations, reducing reliance on traditional text-based learning and promoting interactive exploration of historical data.
            </p>
            
            <p className="text-lg mb-6">
              By presenting historical events on a 3D globe with connections between related events, we help students, teachers, and history enthusiasts understand the complex web of cause and effect that shaped our world.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="members">Contact Us</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <span className="text-lg font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Interactive 3D Globe</h3>
                        <p className="text-foreground/70">Navigate a fully interactive globe with event pins marking historical locations.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <span className="text-lg font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Chronological Timeline</h3>
                        <p className="text-foreground/70">Explore events year by year with our interactive timeline slider.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <span className="text-lg font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Event Relationship Visualization</h3>
                        <p className="text-foreground/70">See connections between historical events with our network graph visualization.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                        <span className="text-lg font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Filtering System</h3>
                        <p className="text-foreground/70">Filter events by time period and event type for targeted learning.</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="technology" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
                  <p className="mb-6">Our platform is built using modern web technologies to deliver a seamless, interactive experience:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-panel p-4">
                      <h3 className="text-lg font-medium mb-2">Frontend</h3>
                      <ul className="list-disc list-inside text-foreground/70">
                        <li>React for UI components</li>
                        <li>TypeScript for type safety</li>
                        <li>Tailwind CSS for styling</li>
                        <li>D3.js for data visualizations</li>
                        <li>Three.js for 3D globe rendering</li>
                      </ul>
                    </div>
                    
                    <div className="glass-panel p-4">
                      <h3 className="text-lg font-medium mb-2">Data Structures</h3>
                      <ul className="list-disc list-inside text-foreground/70">
                        <li>Graph data structures for event relationships</li>
                        <li>Temporal data structures for timeline</li>
                        <li>Geospatial indexing for location search</li>
                        <li>JSON-based data schema</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="members" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-3xl font-bold mb-6">Team Members</h2>
                  <ol className="list-decimal list-inside space-y-2 text-lg mb-6 text-center sm:text-left">
                    <li>Piriyakorn Srisook</li>
                    <li>Wattanasuk Limchanyavong</li>
                    <li>Thiraphat Panthong</li>
                    <li>Teerapat Paitoon</li>
                  </ol>
                  <hr className="my-6 border-white/10" />
                  <h3 className="text-3xl font-bold mb-6 text-center sm:text-left">Advisor</h3>
                  <ul className="list-disc list-inside text-lg mb-6 text-center sm:text-left">
                    <li>Dr. Warin Wattanapornprom</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Exploring History Today</h2>
            <p className="mb-6">Dive into our interactive platform and discover the interconnected events that shaped our world.</p>
            <Button asChild size="lg">
              <Link to="/explore">
                Explore the Globe
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 HistoriScope 3D. Educational platform for interactive historical exploration.</p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">Home</Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">About</Link>
              <span className="mx-2">•</span>
              <a href="/about#contact" className="underline hover:text-foreground/80">Contact</a>
              {/* <span className="mx-2">•</span>
              <a href="#" className="underline hover:text-foreground/80">Privacy Policy</a> */}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;