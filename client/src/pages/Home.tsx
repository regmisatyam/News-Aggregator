import { useArticles, useGenerateArticles } from "@/hooks/use-articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Rss } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data: articles, isLoading, error } = useArticles();
  const generateMutation = useGenerateArticles();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-serif italic text-muted-foreground animate-pulse">Printing the latest edition...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-destructive/10 p-6 rounded-none max-w-md border border-destructive/20">
          <h2 className="font-display text-2xl font-bold mb-2 text-destructive">News Feed Error</h2>
          <p className="text-muted-foreground mb-4">We couldn't retrieve the latest stories. Please check your connection.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const featuredArticle = articles?.[0];
  const mainFeed = articles?.slice(1, 7);
  const sidebarFeed = articles?.slice(7);

  return (
    <div className="space-y-12">
      {/* Header Date Line */}
      <div className="border-b border-black py-2 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span>Vol. 1, Issue 42</span>
        <span>{format(new Date(), 'EEEE, MMMM do, yyyy')}</span>
        <span>New York, London, Tokyo</span>
      </div>

      {/* Featured Story */}
      {featuredArticle ? (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ArticleCard article={featuredArticle} featured />
        </section>
      ) : (
        <div className="text-center py-20 bg-secondary/30">
          <Rss className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="font-display text-2xl font-bold text-muted-foreground">No stories available today.</h2>
          <Button 
            className="mt-6"
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Generate News Edition
          </Button>
        </div>
      )}

      {/* Divider */}
      <div className="article-divider" />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Feed (Left Column) */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-baseline justify-between mb-8 border-b-2 border-black pb-2">
            <h3 className="font-sans font-black text-xl uppercase tracking-widest">Top Stories</h3>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs uppercase tracking-wider font-bold h-8"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-3 w-3" />
                  Refresh Edition
                </>
              )}
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
            {mainFeed?.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-4 space-y-8 pl-0 lg:pl-8 lg:border-l border-border">
          <h3 className="font-sans font-black text-xl uppercase tracking-widest mb-6 border-b-2 border-accent pb-2 text-accent">
            In Brief
          </h3>
          
          <div className="space-y-2">
            {sidebarFeed?.map((article) => (
              <ArticleCard key={article.id} article={article} compact />
            ))}
          </div>

          {/* Advertisement Placeholder */}
          <div className="bg-secondary p-8 text-center border border-border mt-12">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground block mb-4">Advertisement</span>
            <h4 className="font-display font-bold text-xl mb-2">The Daily Feed Premium</h4>
            <p className="font-serif text-sm text-muted-foreground mb-4">Get unlimited access to curated intelligence.</p>
            <Button variant="default" className="w-full">Subscribe Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
