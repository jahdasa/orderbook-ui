import './App.css';
import OrderBookComponent from "./OrderBookComponent";
import { OrderBookStateProvider } from "./OrderBookComponent";
import Chart from "./Chart";
import {Grid} from "@mui/material";

function App() {
    return (
        <div className="App">
            <OrderBookStateProvider>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <OrderBookComponent/>
                    </Grid>
                    <Grid item xs={6}>
                        <Chart/>
                    </Grid>
                </Grid>
            </OrderBookStateProvider>
        </div>
    )
}

export default App;
