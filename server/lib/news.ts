import Parser from 'rss-parser';

const parser = new Parser();

// Reliable RSS Feeds
const RSS_FEEDS = {
  World: ['https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.aljazeera.com/xml/rss/all.xml'],
  Technology: ['https://techcrunch.com/feed/', 'https://www.theverge.com/rss/index.xml'],
  Business: ['https://feeds.content.dowjones.com/public/rss/mw_topstories', 'https://www.cnbc.com/id/10001147/device/rss/rss.html'],
  Politics: ['https://feeds.bbci.co.uk/news/politics/rss.xml'],
  Entertainment: ['https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml'],
  Science: ['https://www.sciencedaily.com/rss/top_news.xml', 'https://www.nasa.gov/rss/dyn/breaking_news.rss'],
  Sports: ['https://www.espn.com/espn/rss/news', 'https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0WEEF40KeyAuxN-0FBr9sr4FC3hNy']
};

export async function fetchRSSNews() {
  const articles = [];

  for (const [category, urls] of Object.entries(RSS_FEEDS)) {
    for (const url of urls) {
      try {
        const feed = await parser.parseURL(url);
        // Take top 2 from each feed to avoid overwhelming
        for (const item of feed.items.slice(0, 2)) {
          if (item.title && (item.content || item.contentSnippet || item.summary)) {
            articles.push({
              title: item.title,
              content: item.content || item.contentSnippet || item.summary || "",
              category,
              originalSource: item.link || item.guid || item.title
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching RSS from ${url}:`, err);
      }
    }
  }
  
  return articles;
}
