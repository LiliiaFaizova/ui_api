import walletData from './data.json';
import { Currency, Transaction } from './types';
const MoexAPI = require('moex-api');

class Wallet {
    data: Currency[] = [];
    moexApi: any;

    constructor() {
        this.moexApi = new MoexAPI();
        this.data = JSON.parse(JSON.stringify(walletData));
    }

    async getWallet() {
        for (const curr of this.data) {
            if (curr.id !== 'rub') {
                curr.price = await this.getPrice(curr);
            }
        }
        return this.data.map((curr) => ({
            id: curr.id,
            name: curr.name,
            count: curr.count.toFixed(2),
            symbol: curr.symbol,
            price: curr.price?.toFixed(3),
            secId: curr.secId,
        }));
    }

    async makeTransaction(transaction: Transaction) {
        const curr = this.data.find((c) => c.id === transaction.currId)!;
        const rubCurr = this.data.find((c) => c.id === 'rub')!;
        const price = await this.getPrice(curr);
        if (transaction.type === 'buy') {
            if (transaction.count * price > rubCurr.count) {
                return { status: 'error', reason: `не хватает денег для покупки ${curr.name}, нужно ${transaction.count * price} ${rubCurr.symbol}, доступно ${rubCurr.count} ${rubCurr.symbol}` };
            } else {
                rubCurr.count -= transaction.count * price;
                curr.count += transaction.count;
                return { status: 'success' };
            }
        } else if (transaction.type === 'sell') {
            if (transaction.count > curr.count) {
                return { status: 'error', reason: `не хватает валюты "${curr.name}" для продажи ${transaction.count} ${curr.symbol}, доступно ${curr.count} ${curr.symbol}` };
            } else {
                curr.count -= transaction.count;
                rubCurr.count += transaction.count * price;
                return { status: 'success' };
            }
        } else {
            return { status: 'error', reason: `неизвестный тип операции: ${transaction.type}` };
        }
    }

    async reset() {
        this.data = JSON.parse(JSON.stringify(walletData));
        await this.getWallet();
    }

    private async getPrice(curr: Currency) {
        const sec = await this.moexApi.securityMarketData(curr.secId);
        return sec.node.last;
    }
}

const model = new Wallet();

export default model;