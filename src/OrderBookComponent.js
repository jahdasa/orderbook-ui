import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import OrderBookService from './OrderBookService';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Grid} from "@mui/material";

const orderBookInitialState = {orderBook: [], setOrderBook: undefined};

const OrderBookStateContext = createContext(orderBookInitialState);

function formatNumber(number)
{
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const symbols =
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

const symbolsMap = new Map(
    symbols.data.instruments.map(item => [item.code, item])
);

export const OrderBookStateProvider = ({children}) => {
    const [orderBook, setOrderBook] = useState(orderBookInitialState.orderBook);
    const orderBookContextValue = useMemo(() => ({orderBook, setOrderBook}), [orderBook]);

    return (
        <OrderBookStateContext.Provider value={orderBookContextValue}>
            {children}
        </OrderBookStateContext.Provider>
    )
}

export const useOrderBookState = () => useContext(OrderBookStateContext);

function findBestBuyAndSell(data)
{
    // Initialize variables to track best buy and sell
    let bestBuyPrice = null;
    let bestSellPrice = null;


    // Iterate through each line
    data.forEach(line =>
    {
        if (line.side === 'BUY')
        {
            // For buy orders, we want the highest price
            if (bestBuyPrice === null || line.price > bestBuyPrice)
            {
                bestBuyPrice = line.price;
            }
        }

        if (line.side === 'SELL')
        {
            // For sell orders, we want the lowest price
            if (bestSellPrice === null || line.price < bestSellPrice)
            {
                bestSellPrice = line.price;
            }
        }
    });

    const bbo = {bid: bestBuyPrice, ask: bestSellPrice};

    return bbo;
}

function OrderBookComponent()
{
    const [levelSize, setLevelSize] = useState(5);
    const [product, setProduct] = useState("BTCIRT");
    const [bbo, setBbo] = useState({bid: 0, ask: 0});
    const {orderBook, setOrderBook} = useOrderBookState();
    const [isActive, setIsActive] = useState(false);

    function toggle() {
        setIsActive(!isActive);
    }

    function reset() {
        setOrderBook([]);
        setBbo({bid: 0, ask: 0})
        setIsActive(false);
    }

    useEffect(() => {
        let interval = null;
        if (isActive)
        {
            interval = setInterval(() => {
                OrderBookService.getOrderBook(product)
                    .then((response) =>
                    {
                        const lines = response.data.data.lines;
                        setOrderBook(lines);

                        const bbo = findBestBuyAndSell(lines);
                        setBbo(bbo)
                    })
            }, 1000);
        } else if (!isActive && orderBook !== [])
        {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [setOrderBook, product, isActive, orderBook]);

    return (
        <Grid container spacing={2}>
            <Grid container item xs={12} spacing={2}>
                <Grid item xs={6}>
                    <h1 className="text-center">Symbols</h1>
                    <TableContainer component={Paper} elevation={3}>
                        <Table aria-label="symbol table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Symbol</TableCell>
                                    <TableCell align="right">Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.from(symbolsMap.entries()).map(([code, value]) => (
                                    <TableRow
                                        key={code}
                                        onClick={() => setProduct(code)}
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            cursor: 'pointer',
                                            backgroundColor: product === code ? '#f5f5f5' : 'inherit',
                                            '&:hover': { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {code}
                                        </TableCell>
                                        <TableCell align="right">{value.name}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={6}>
                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button
                            onClick={toggle}
                            variant={isActive ? 'outlined' : 'contained'}
                        >
                            {isActive ? 'Pause' : 'Start'}
                        </Button>
                        <Button onClick={reset}>Reset</Button>
                    </ButtonGroup>

                    <h1 className="text-center">Order Book {product}</h1>
                    <h2>Mid = {((Number(bbo.ask) + Number(bbo.bid)) / 2).toFixed(2)}</h2>
                    <h2>(spread = {(bbo.ask - bbo.bid).toFixed(2)})</h2>

                    <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button
                            onClick={() => setLevelSize(5)}
                            variant={ levelSize === 5 ? 'outlined' : 'contained'}
                        > 5
                        </Button>
                        <Button
                            onClick={() => setLevelSize(10)}
                                variant={levelSize === 10 ? 'outlined' : 'contained'}
                        >10</Button>
                        <Button
                            onClick={() => setLevelSize(200)}
                            variant={levelSize === 200 ? 'outlined' : 'contained'}
                        >ALL</Button>
                    </ButtonGroup>

                    <TableContainer component={Paper} elevation={3}>
                        <Table aria-label="price table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell align="right">Size</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    orderBook
                                        .filter(row => row.side === 'SELL')
                                        .slice(-levelSize)
                                        .concat(
                                            orderBook
                                                .filter(row => row.side === 'BUY')
                                                .slice(0, levelSize)
                                        )
                                        .map((row) => (
                                            <TableRow
                                                key={row.price}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    style={{ color: row.side === 'BUY' ? 'green' : 'red' }}
                                                >
                                                    {formatNumber(row.price.toFixed(2))}
                                                </TableCell>
                                                <TableCell align="right">{row.quantity.toFixed(8)}</TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </Grid>
    )
}

export default OrderBookComponent
