import axios from "axios";
import * as cheerio from "cheerio";

interface Article {
    title: string;
    url: string;
    author: string;
    publishDate: Date;
    summary: string;
    category: string;
}

export class CoindeskScraper {
    private baseUrl: string = "https://www.coindesk.com";

    /**
     * Fetches and parses articles from the CoinDesk homepage
     * @returns Promise<Article[]> Array of parsed articles
     */
    async scrapeLatestArticles(): Promise<Article[]> {
        try {
            const response = await axios.get(this.baseUrl);
            const html = response.data;
            const $ = cheerio.load(html);
            const articles: Article[] = [];

            // Select article containers from the homepage
            $(".article-cardstyles__StyledWrapper").each((_, element) => {
                const articleElement = $(element);

                const title = articleElement.find("h6").text().trim();
                const relativeUrl = articleElement.find("a").attr("href") || "";
                const url = this.baseUrl + relativeUrl;
                const author = articleElement
                    .find(".article-cardstyles__StyledAuthor")
                    .text()
                    .trim();
                const dateStr =
                    articleElement.find("time").attr("datetime") || "";
                const summary = articleElement
                    .find(".article-cardstyles__StyledSummary")
                    .text()
                    .trim();
                const category = articleElement
                    .find(".article-cardstyles__StyledCategory")
                    .text()
                    .trim();

                if (title && url) {
                    articles.push({
                        title,
                        url,
                        author,
                        publishDate: new Date(dateStr),
                        summary,
                        category,
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error("Error scraping CoinDesk:", error);
            throw error;
        }
    }

    /**
     * Scrapes a specific article page for detailed content
     * @param url URL of the article to scrape
     * @returns Promise<string> Article content
     */
    async scrapeArticleContent(url: string): Promise<string> {
        try {
            const response = await axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);

            // Get the main article content
            const content = $(".content-wrapper").text().trim();

            return content;
        } catch (error) {
            console.error(`Error scraping article content from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Searches for articles by keyword
     * @param keyword Search term
     * @returns Promise<Article[]> Array of matching articles
     */
    async searchArticles(keyword: string): Promise<Article[]> {
        try {
            const searchUrl = `${this.baseUrl}/search?q=${encodeURIComponent(keyword)}`;
            const response = await axios.get(searchUrl);
            const html = response.data;
            const $ = cheerio.load(html);
            const articles: Article[] = [];

            // Select search result articles
            $(".search-results article").each((_, element) => {
                const articleElement = $(element);

                const title = articleElement.find("h2").text().trim();
                const relativeUrl = articleElement.find("a").attr("href") || "";
                const url = this.baseUrl + relativeUrl;
                const author = articleElement.find(".author").text().trim();
                const dateStr =
                    articleElement.find(".published-date").attr("datetime") ||
                    "";
                const summary = articleElement.find(".summary").text().trim();
                const category = articleElement.find(".category").text().trim();

                if (title && url) {
                    articles.push({
                        title,
                        url,
                        author,
                        publishDate: new Date(dateStr),
                        summary,
                        category,
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error(
                `Error searching for articles with keyword "${keyword}":`,
                error
            );
            throw error;
        }
    }
}

// Example usage:

const scraper = new CoindeskScraper();

// Get latest articles
const articles = await scraper.scrapeLatestArticles();
console.log("Latest articles:", articles);

// Get content from specific article
const articleContent = await scraper.scrapeArticleContent(articles[0].url);
console.log("Article content:", articleContent);

// Search for articles about Bitcoin
const bitcoinArticles = await scraper.searchArticles("Bitcoin");
console.log("Bitcoin articles:", bitcoinArticles);
