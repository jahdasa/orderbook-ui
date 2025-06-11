import axios from 'axios'

const ORDERBOOK_API = 'http://localhost:8080/api/v1/submit-admin-message?securityId=101&adminMessageType=MarketDepth&requestId=1&trader=1&client=1';

const response =
    {
        "status": 200,
        "data": {
            "correlationId": "42@1749656326021@1",
            "instruments": [
                {
                    "securityId": 101,
                    "code": "BTCIRT",
                    "name": "BITCOIN/IRAN-TOMAN"
                },
                {
                    "securityId": 102,
                    "code": "USDTIRT",
                    "name": "USDT/IRAN-TOMAN"
                },
                {
                    "securityId": 103,
                    "code": "ETHIRT",
                    "name": "ETHERIUM/IRAN-TOMAN"
                },
                {
                    "securityId": 104,
                    "code": "DOGEIRT",
                    "name": "DOGE-COIN/IRAN-TOMAN"
                },
                {
                    "securityId": 105,
                    "code": "BNBIRT",
                    "name": "BINANCE-COIN/IRAN-TOMAN"
                },
                {
                    "securityId": 106,
                    "code": "BTCUSDT",
                    "name": "BITCOIN/USDT"
                },
                {
                    "securityId": 107,
                    "code": "ETHUSDT",
                    "name": "ETHERIUM/USDT"
                },
                {
                    "securityId": 108,
                    "code": "DOGEUSDT",
                    "name": "DOGE-COIN/USDT"
                },
                {
                    "securityId": 109,
                    "code": "BNBUSDT",
                    "name": "BINANCE-COIN/USDT"
                },
                {
                    "securityId": 110,
                    "code": "EOSUSDT",
                    "name": "EOS/USDT"
                },
                {
                    "securityId": 111,
                    "code": "ETCIRT",
                    "name": "ETHERIUM-CLASSIC/IRAN-TOMAN"
                },
                {
                    "securityId": 112,
                    "code": "ETCUSDT",
                    "name": "ETHERIUM-CLASSIC/USDT"
                }
            ]
        },
        "error": null
    };

const instrumentsMap = new Map(
    response.data.instruments.map(item => [item.code, item])
);

function generateOrderBookUrl(code)
{
    const instrument = instrumentsMap.get(code);
    if (!instrument) {
        throw new Error(`Instrument with code "${code}" not found!`);
    }

    const { securityId } = instrument;
    return `http://localhost:8080/api/v1/submit-admin-message?securityId=${securityId}&adminMessageType=MarketDepth&requestId=1&trader=1&client=1`;
}

class OrderBookService
{

    getOrderBook(code)
    {
        return axios.get( generateOrderBookUrl(code));
    }
}

export default new OrderBookService();
