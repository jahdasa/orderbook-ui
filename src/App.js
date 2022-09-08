import './App.css';
import OrderBookComponent, {OrderBookStateProvider} from "./OrderBookComponent";
import Chart from "./Chart";
import {Container, Grid} from "@mui/material";

function App() {
    return (
        <div className="App">
            <br/>
            <Container maxWidth="xl">
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
            </Container>
        </div>
    )
}

export default App;
