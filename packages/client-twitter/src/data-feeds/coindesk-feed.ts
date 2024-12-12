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
            const response = await fetch(this.url + `/${page}`, {
                headers: this.headers,
            });
            const html = await response.text();
            const $ = cheerio.load(html);
            const articles: DataFeedItem[] = [];

            $(this.itemHtmlIdentifier).each((_, element) => {
                const $element = $(element);
                const title = $element
                    .find("h1, h2, h3, h4, h5, h6")
                    .text()
                    .trim();
                const link = $element.find("a").first().attr("href");
                const overviewContent =
                    title +
                    "\n\n" +
                    $element.find('p, div[class*="text"]').text().trim();

                if (title && link) {
                    articles.push({
                        id: `https://coindesk.com${link}`,
                        createdAt: new Date(),
                        overviewContent,
                        content: undefined,
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
            console.log("Fetching article details for ID", id);
            const response = await fetch(id, {
                headers: this.headers,
            });
            console.log("Fetching article details for ID", id);
            const html = await response.text();
            console.log("Fetched article details for ID", id);
            const $ = cheerio.load(html);
            console.log("Loaded article details for ID", id);

            const content = $(".document-body")
                .find("p")
                .map((_, el) => $(el).text().trim())
                .get()
                .filter((text) => text.length > 0)
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
