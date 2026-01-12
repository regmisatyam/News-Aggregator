import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type Article } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useArticles(category?: string) {
  return useQuery({
    queryKey: [api.articles.list.path, category],
    queryFn: async () => {
      const url = buildUrl(api.articles.list.path);
      const searchParams = new URLSearchParams();
      if (category) searchParams.append("category", category);
      
      const res = await fetch(`${url}?${searchParams.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch articles");
      return api.articles.list.responses[200].parse(await res.json());
    },
  });
}

export function useArticle(id: number) {
  return useQuery({
    queryKey: [api.articles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.articles.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch article");
      
      return api.articles.get.responses[200].parse(await res.json());
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateArticles() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.articles.generate.path, {
        method: api.articles.generate.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate articles");
      return await res.json();
    },
    onSuccess: (data: { count: number }) => {
      queryClient.invalidateQueries({ queryKey: [api.articles.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.categories.list.path] });
      toast({
        title: "Edition Updated",
        description: `Successfully generated ${data.count} new articles from latest sources.`,
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not generate new articles. Please try again later.",
        variant: "destructive",
      });
    },
  });
}
