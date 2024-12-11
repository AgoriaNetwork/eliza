export interface DataFeedItem {
    id: string;
    createdAt: Date;
    url?: string;
    overviewContent?: string;
    content?: string;
}

export interface IDataFeed {
    name: string; // should be unique
    url: string;
    itemHtmlIdentifier: string | null;
    availableFeeds: string[];

    fetchItems(page: string): Promise<DataFeedItem[] | DataFeedItem>;
    getItemDetails(id: string): Promise<DataFeedItem | null>;
}
