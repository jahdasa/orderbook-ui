import axios from 'axios'

const ORDERBOOK_API = 'http://localhost:4567/orderbook/';

class OrderBookService {

    getOrderBook(product: string) {
        return axios.get(ORDERBOOK_API + product);
    }
}

export default new OrderBookService();
