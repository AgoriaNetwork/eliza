export interface DataFeedItem {
    id: string;
    createdAt: Date;
    overviewContent?: string;
    content?: string;
}

export interface IDataFeed {
    name: string; // should be unique
    url: string;
    itemHtmlIdentifier: string | null;

    fetchItems(): Promise<DataFeedItem[] | DataFeedItem>;
    getItemDetails(id: string): Promise<DataFeedItem | null>;
}
