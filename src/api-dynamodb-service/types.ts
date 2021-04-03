export interface Event<T> {
    queryStringParameters?: T;
    body?: string;
}

export interface Cocktail {
    name: string;
    taste: string;
    alcohol: string;
    size: string;
    liquor: string;
}
