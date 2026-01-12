import { Newspaper } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 mt-20 border-t-8 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Newspaper className="h-8 w-8 text-accent" />
              <span className="font-display font-black text-3xl tracking-tighter">THE DAILY FEED</span>
            </div>
            <p className="font-serif text-primary-foreground/70 leading-relaxed max-w-sm mb-8">
              Delivering curated intelligence for the modern mind. We aggregate, synthesize, and present the world's most critical stories with clarity and depth.
            </p>
            <div className="text-xs uppercase tracking-widest text-primary-foreground/40">
              © 2024 The Daily Feed. All rights reserved.
            </div>
          </div>

          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-sm mb-6 text-accent">Sections</h4>
            <ul className="space-y-3 font-serif text-sm text-primary-foreground/80">
              <li><Link href="/category/World" className="hover:text-white transition-colors">World</Link></li>
              <li><Link href="/category/Technology" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/category/Business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/category/Science" className="hover:text-white transition-colors">Science</Link></li>
              <li><Link href="/category/Politics" className="hover:text-white transition-colors">Politics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans font-bold uppercase tracking-widest text-sm mb-6 text-accent">About</h4>
            <ul className="space-y-3 font-serif text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-white transition-colors">Masthead</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
