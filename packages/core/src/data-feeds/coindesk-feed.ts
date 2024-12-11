import axios from "axios";
import * as cheerio from "cheerio";
import { IDataFeed, DataFeedItem } from "./data-feed.interface";

export class CoindeskDataFeed implements IDataFeed {
    public readonly name = "coindesk";
    public readonly url = "https://www.coindesk.com";
    public readonly itemHtmlIdentifier = '.grid > div[class*="row-span"]';
    public readonly availableFeeds = [
        "markets",
        "business",
        "tech",
        "policy",
        "opinion",
    ];

    private readonly headers = {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    };

    async fetchItems(page = this.availableFeeds[0]): Promise<DataFeedItem[]> {
        try {
            const response = await axios.get(this.url + `/${page}`, {
                headers: this.headers,
            });
            const $ = cheerio.load(response.data);
            const articles: DataFeedItem[] = [];

            $(this.itemHtmlIdentifier).each((_, element) => {
                const $element = $(element);
                // Look for any heading element (h1-h6) as article titles might use different heading levels
                const title = $element
                    .find("h1, h2, h3, h4, h5, h6")
                    .text()
                    .trim();
                const link = $element.find("a").first().attr("href");
                // Look for text content in paragraphs or divs that might contain the overview
                const overviewContent =
                    title +
                    "\n\n" +
                    $element.find('p, div[class*="text"]').text().trim();

                if (title && link) {
                    articles.push({
                        id: `https://coindesk.com${link}`,
                        createdAt: new Date(),
                        overviewContent,
                        content: undefined, // Full content will be fetched separately
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error("Error fetching CoinDesk articles:", error);
            throw new Error("Failed to fetch CoinDesk articles");
        }
    }

    async getItemDetails(id: string): Promise<DataFeedItem | null> {
        try {
            // Reconstruct the article URL from the ID
            const response = await axios.get(id, {
                headers: this.headers,
            });
            const $ = cheerio.load(response.data);

            // Extract the main article content from .document-body
            const content = $(".document-body")
                .find("p")
                .map((_, el) => $(el).text().trim())
                .get()
                .filter((text) => text.length > 0) // Remove empty paragraphs
                .join("\n\n");

            const overviewContent =
                $('meta[name="description"]').attr("content") || "";
            const publishDate = $(
                'meta[property="article:published_time"]'
            ).attr("content");

            if (!content) {
                return null;
            }

            return {
                id,
                createdAt: publishDate ? new Date(publishDate) : new Date(),
                overviewContent,
                content,
            };
        } catch (error) {
            console.error(
                `Error fetching article details for ID ${id}:`,
                error
            );
            return null;
        }
    }
}

// Testing function
async function main() {
    console.log("Fetching crypto markets...");
    try {
        const datafeed = new CoindeskDataFeed();

        // Fetch latest articles
        const articles = await datafeed.fetchItems("business");
        console.log("Latest articles:", articles);

        // Get details for a specific article
        if (articles.length > 0) {
            const details = await datafeed.getItemDetails(articles[0].id);
            console.log("Article details:", details);
        }
    } catch (error) {
        console.error(
            "Main error:",
            error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
    }
}

main();
