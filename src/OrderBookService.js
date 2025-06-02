import axios from 'axios'

const ORDERBOOK_API = 'http://localhost:8080/api/v1/submit-admin-message?securityId=101&adminMessageType=MarketDepth&requestId=1&trader=1&client=1';

class OrderBookService {

    getOrderBook() {
        return axios.get(ORDERBOOK_API);
    }
}

export default new OrderBookService();
