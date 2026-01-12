import { useArticles } from "@/hooks/use-articles";
import { ArticleCard } from "@/components/ArticleCard";
import { Loader2 } from "lucide-react";
import { useRoute } from "wouter";
import { useEffect } from "react";

export default function Category() {
  const [, params] = useRoute("/category/:name");
  const categoryName = decodeURIComponent(params?.name || "");
  const { data: articles, isLoading, refetch } = useArticles(categoryName);

  // Refetch when category changes
  useEffect(() => {
    refetch();
  }, [categoryName, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-serif italic text-muted-foreground">Curating {categoryName} stories...</p>
      </div>
    );
  }

  const headerStyle = "py-16 md:py-24 text-center border-b border-black mb-12 bg-secondary/20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8";

  return (
    <div>
      <div className={headerStyle}>
        <span className="font-sans font-bold text-sm tracking-[0.2em] uppercase text-accent mb-4 block">
          Section
        </span>
        <h1 className="font-display font-black text-5xl md:text-7xl mb-4 text-primary tracking-tight">
          {categoryName}
        </h1>
        <p className="font-serif text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto italic">
          Latest developments, analysis, and breaking news from the world of {categoryName}.
        </p>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="font-display text-2xl text-muted-foreground">No stories found in this section.</h3>
        </div>
      )}
    </div>
  );
}
