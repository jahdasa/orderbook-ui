import React, {useEffect, useState} from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useOrderBookState} from "./OrderBookComponent";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const options = {
    responsive: true,
    scales: {
        y: {
            // suggestedMin: 0,
            suggestedMax: 10,//TODO calculate based on vwap
        }
    },
    plugins: {
        legend: {
            position: 'top',
            display: false
        }
    },
};

export default function Chart() {

    const {orderBook} = useOrderBookState();
    const labels = []
    const [state, setState] = useState({
        labels,
        datasets: [
            {
                label: 'Bids',
                fill: true,
                data: labels.map(() => null),
                borderColor: 'rgb(70,161,41)',
                backgroundColor: 'rgba(56,155,29,0.5)',
                stepped: 'before',
            },
            {
                label: 'asks',
                fill: true,
                data: labels.map(() => null),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                stepped: 'after',
            },
        ],
    })

    useEffect(() => {
        setState({
            labels: orderBook.map(value => value.priceLevel),
            datasets: [
                {
                    label: 'Bids',
                    fill: true,
                    data: orderBook.map((v) => v.side === 'BUY' ? v.total : null),
                    borderColor: 'rgb(70,161,41)',
                    backgroundColor: 'rgba(56,155,29,0.5)',
                    stepped: 'after',
                },
                {
                    label: 'Asks',
                    fill: true,
                    data: orderBook.map((v) => v.side === 'SELL' ? v.total : null),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    stepped: 'before',
                },
            ],
        });
    }, [orderBook])
    return (
        <Line options={options} data={state}/>
    );
}
