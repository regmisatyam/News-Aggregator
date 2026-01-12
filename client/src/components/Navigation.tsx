import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/use-articles";
import { Newspaper, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { data: categories = [] } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Default categories if none exist yet
  const displayCategories = categories.length > 0 
    ? categories 
    : ["World", "Technology", "Business", "Politics", "Science", "Sports"];

  return (
    <nav className="border-b-4 border-double border-primary/20 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-none group-hover:bg-accent transition-colors duration-300">
              <Newspaper className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tighter leading-none">THE DAILY FEED</span>
              <span className="text-[10px] font-serif tracking-widest uppercase text-muted-foreground group-hover:text-accent transition-colors">Curated Intelligence</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className={cn(
                "font-sans text-sm font-bold tracking-wide uppercase hover:text-accent transition-colors",
                location === "/" ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
              )}
            >
              Top Stories
            </Link>
            
            {displayCategories.slice(0, 5).map((category) => (
              <Link 
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className={cn(
                  "font-sans text-sm font-bold tracking-wide uppercase hover:text-accent transition-colors",
                  location === `/category/${encodeURIComponent(category)}` ? "text-accent border-b-2 border-accent" : "text-muted-foreground"
                )}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background absolute w-full shadow-xl animate-accordion-down">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link 
              href="/"
              className="block px-3 py-4 text-base font-bold uppercase border-b border-border"
              onClick={() => setMobileMenuOpen(false)}
            >
              Top Stories
            </Link>
            {displayCategories.map((category) => (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category)}`}
                className="block px-3 py-4 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
