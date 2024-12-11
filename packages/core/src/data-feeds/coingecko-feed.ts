import { IDataFeed, DataFeedItem } from "./data-feed.interface.ts";

interface CoinGeckoMarketItem {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

export class CryptoNewsDataFeed implements IDataFeed {
    name = "crypto-markets";
    itemHtmlIdentifier = null;

    url =
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en";

    formatPrice(price: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    }

    formatMarketCap(marketCap: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact",
        }).format(marketCap);
    }

    async fetchItems(): Promise<DataFeedItem[]> {
        try {
            const response = await fetch(this.url);

            if (!response.ok) {
                const error = await response.text();
                throw new Error(
                    `HTTP error! status: ${response.status}, message: ${error}`
                );
            }

            const data = (await response.json()) as CoinGeckoMarketItem[];

            if (!Array.isArray(data)) {
                throw new Error("Invalid response format: expected array");
            }

            return data.map((item: CoinGeckoMarketItem) => ({
                id: item.id,
                createdAt: new Date(item.last_updated),
                overviewContent: `${item.name} (${item.symbol.toUpperCase()})`,
                content: [
                    `Price: ${this.formatPrice(item.current_price)}`,
                    `Market Cap: ${this.formatMarketCap(item.market_cap)}`,
                    `24h Change: ${item.price_change_percentage_24h.toFixed(2)}%`,
                ].join("\n"),
            }));
        } catch (error) {
            console.error(
                "Error fetching crypto markets:",
                error instanceof Error ? error.message : String(error)
            );
            return [];
        }
    }

    async getItemDetails(id: string): Promise<DataFeedItem | null> {
        try {
            const items = await this.fetchItems();
            return items.find((item) => item.id === id) || null;
        } catch (error) {
            console.error(
                "Error getting item details:",
                error instanceof Error ? error.message : String(error)
            );
            return null;
        }
    }
}

// Testing function
async function main() {
    console.log("Fetching crypto markets...");
    try {
        const feed = new CryptoNewsDataFeed();
        const items = await feed.fetchItems();

        console.log("Fetched items:");
        items.forEach((item) => {
            console.log("\n-------------------");
            console.log(item.overviewContent);
            console.log(item.content);
            console.log(`Updated: ${item.createdAt.toLocaleString()}`);
        });
    } catch (error) {
        console.error(
            "Main error:",
            error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
    }
}

main();
