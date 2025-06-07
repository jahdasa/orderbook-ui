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
    interaction: {
        mode: 'index',
        intersect: false,
    },
    scales: {
        x: {
            type: 'linear',
            suggestedMin: 82000000000,
            suggestedMax: 90000000000, // 10% بیشتر از حجم کل
            title: {
                display: true,
                text: 'Price',
                font: {
                    weight: 'bold'
                }
            },
            ticks: {
                callback: function(value)
                {
                    if (value >= 10000000) return (value/10000000).toFixed(1) + 'M';
                    if (value >= 10000) return (value/10000).toFixed(1) + 'K';
                    return value
                }
            }
        },
        y: {
            type: 'linear',
            suggestedMin: 0,
            suggestedMax: 0.1, // 10% بیشتر از حجم کل
            ticks: {
                callback: function(value) {
                    return value.toFixed(6);
                }
            }
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
                stepped: 'true',
            },
            {
                label: 'asks',
                fill: true,
                data: labels.map(() => null),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                stepped: 'true',
            },
        ],
    })



    useEffect(() =>
    {
        setState({
            labels: orderBook.map(value => value.price),
            datasets: [
                {
                    label: 'Bids',
                    fill: true,
                    data: orderBook.map((v) => v.side === 'Buy' ? v.total : null),
                    borderColor: 'rgb(70,161,41)',
                    backgroundColor: 'rgba(56,155,29,0.5)',
                    stepped: 'after',
                },
                {
                    label: 'Asks',
                    fill: true,
                    data: orderBook.map((v) => v.side === 'Sell' ? v.total : null),
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
