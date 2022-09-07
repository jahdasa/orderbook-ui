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
import Container from '@mui/material/Container';

const orderBookInitialState = { orderBook: [], setOrderBook: undefined };

const OrderBookStateContext = createContext(orderBookInitialState);

export const OrderBookStateProvider = ({ children }) => {
    const [orderBook, setOrderBook] = useState(orderBookInitialState.orderBook);
    const orderBookContextValue = useMemo(() => ({orderBook, setOrderBook}), [orderBook]);

    return (
        <OrderBookStateContext.Provider value={orderBookContextValue}>
                    {children}
        </OrderBookStateContext.Provider>
    )
}

export const useOrderBookState = () => useContext(OrderBookStateContext);

function OrderBookComponent() {

    const [product, setProduct] = useState("ETH-USD");
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
        if (isActive) {
            const params = new URLSearchParams(window.location.search)
            let id = params.get('productId') || 'ETH-USD'
            setProduct(id);
            interval = setInterval(() => {
                OrderBookService.getOrderBook(product)
                    .then((response) => {
                        setOrderBook(response.data);
                        setBbo({
                            bid: orderBook[orderBook.length / 2].priceLevel.toFixed(2),
                            ask: orderBook && orderBook[orderBook.length / 2 - 1].priceLevel.toFixed(2)
                        })
                    })
            }, 250);
        } else if (!isActive && orderBook !== []) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [setOrderBook, product, isActive, orderBook]);

    return (
        <div>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={toggle}
                        variant={isActive ? 'outlined' : 'contained'}>{isActive ? 'Pause' : 'Start'}</Button>
                <Button onClick={reset}>Reset</Button>
            </ButtonGroup>

            <h1 className="text-center">Order Book {product}</h1>
            <h2>Mid = {((Number(bbo.ask) + Number(bbo.bid)) / 2).toFixed(2)}
                (spread = {(bbo.ask - bbo.bid).toFixed(2)})</h2>

            <Container maxWidth="md">
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Size</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderBook.map((row) => (
                                <TableRow
                                    key={row.price}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row"
                                               style={{color: (row.side === 'BUY' ? 'green' : 'red')}}>
                                        {row.priceLevel.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">{row.size.toFixed(8)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </div>
    )
}

export default OrderBookComponent
