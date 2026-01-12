import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Article } from "@shared/routes";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  compact?: boolean;
}

export function ArticleCard({ article, featured = false, compact = false }: ArticleCardProps) {
  const formattedDate = article.createdAt 
    ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
    : 'Recently';

  if (compact) {
    return (
      <Link href={`/article/${article.id}`} className="group flex gap-4 items-start py-4 border-b border-border/60 hover:bg-secondary/30 transition-colors p-2 -mx-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
              {article.category}
            </span>
            <span className="text-[10px] text-muted-foreground">• {formattedDate}</span>
          </div>
          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-accent transition-colors line-clamp-2">
            {article.title}
          </h3>
        </div>
        {article.imageUrl && (
          <div className="w-24 h-16 shrink-0 bg-muted overflow-hidden">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}
      </Link>
    );
  }

  if (featured) {
    return (
      <Link href={`/article/${article.id}`} className="group block mb-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 uppercase tracking-widest">
                {article.category}
              </span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {formattedDate}
              </span>
            </div>
            
            <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[0.95] group-hover:text-accent transition-colors">
              {article.title}
            </h2>
            
            <p className="font-serif text-lg md:text-xl text-muted-foreground leading-relaxed line-clamp-3">
              {article.summary}
            </p>
            
            <div className="pt-4 flex items-center text-primary font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform duration-300">
              Read Full Story <span className="ml-2">→</span>
            </div>
          </div>
          
          <div className="order-1 md:order-2 aspect-[4/3] bg-muted overflow-hidden shadow-2xl shadow-black/5 relative border border-border">
            {article.imageUrl ? (
              <img 
                src={article.imageUrl} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                <span className="font-display text-4xl italic opacity-20">The Daily Feed</span>
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`} className="group flex flex-col h-full border border-transparent hover:border-border hover:bg-white hover:shadow-lg transition-all duration-300 p-4 -m-4">
      {article.imageUrl && (
        <div className="aspect-video w-full bg-muted mb-4 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-accent border-b border-accent/20">
            {article.category}
          </span>
          <span className="text-xs text-muted-foreground font-serif italic">
            {formattedDate}
          </span>
        </div>
        
        <h3 className="font-display font-bold text-2xl leading-tight mb-3 group-hover:text-primary/80 transition-colors line-clamp-3">
          {article.title}
        </h3>
        
        <p className="font-serif text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
          {article.summary}
        </p>
        
        <div className="mt-auto text-xs font-bold uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors">
          Read More
        </div>
      </div>
    </Link>
  );
}
