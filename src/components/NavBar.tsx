
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NavBar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <NavLink to="/" className="text-xl font-bold font-playfair text-white flex items-center gap-2">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-pulse"></div>
              <div className="absolute inset-1 rounded-full bg-blue-600 opacity-70"></div>
              <div className="absolute inset-2 rounded-full bg-blue-700"></div>
              <div className="absolute inset-[10px] rounded-full bg-blue-900"></div>
            </div>
            <span className="hidden sm:block">Globes of History</span>
          </NavLink>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive
                ? "text-primary font-medium border-b-2 border-primary py-1"
                : "text-foreground/70 hover:text-primary transition-colors py-1"
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/explore" 
            className={({ isActive }) => 
              isActive
                ? "text-primary font-medium border-b-2 border-primary py-1"
                : "text-foreground/70 hover:text-primary transition-colors py-1"
            }
          >
            Explore
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive
                ? "text-primary font-medium border-b-2 border-primary py-1"
                : "text-foreground/70 hover:text-primary transition-colors py-1"
            }
          >
            About
          </NavLink>
        </nav>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-l border-white/10">
              <nav className="flex flex-col gap-4 mt-8">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive
                      ? "text-primary font-medium text-lg"
                      : "text-foreground/70 hover:text-primary transition-colors text-lg"
                  }
                >
                  Home
                </NavLink>
                <NavLink 
                  to="/explore" 
                  className={({ isActive }) => 
                    isActive
                      ? "text-primary font-medium text-lg"
                      : "text-foreground/70 hover:text-primary transition-colors text-lg"
                  }
                >
                  Explore
                </NavLink>
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => 
                    isActive
                      ? "text-primary font-medium text-lg"
                      : "text-foreground/70 hover:text-primary transition-colors text-lg"
                  }
                >
                  About
                </NavLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
