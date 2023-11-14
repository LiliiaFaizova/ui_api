export type Currency = {
    id: string;
    name: string;
    count: number;
    symbol: string;
    price?: number;
    secId: string;
};

export type Transaction = {
    currId: string;
    type: string;
    count: number;
}