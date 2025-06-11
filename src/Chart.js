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

export default function Chart() {
    const {orderBook} = useOrderBookState();
    const [options, setOptions] = useState({
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 0,
                title: {
                    display: true,
                    text: 'Price',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: {
                    callback: function(value) {
                        if (value >= 10000000) return (value/10000000).toFixed(1) + 'M';
                        if (value >= 10000) return (value/10000).toFixed(1) + 'K';
                        return value;
                    }
                }
            },
            y: {
                type: 'linear',
                suggestedMin: 0,
                suggestedMax: 0.3,
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
    });

    const [state, setState] = useState({
        labels: [],
        datasets: [
            {
                label: 'Bids',
                fill: true,
                data: [],
                borderColor: 'rgb(70,161,41)',
                backgroundColor: 'rgba(56,155,29,0.5)',
                stepped: 'after',
            },
            {
                label: 'Asks',
                fill: true,
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                stepped: 'before',
            },
        ],
    });

    useEffect(() => {
        if (orderBook.length > 0)
        {
            const buyOrders = orderBook.filter(order => order.side === 'BUY');
            const minBuyPrice = Math.min(...buyOrders.map(order => order.price));
            const suggestedMin = minBuyPrice * 0.999;

            const sellOrders = orderBook.filter(order => order.side === 'SELL');
            const maxSellPrice = Math.max(...sellOrders.map(order => order.price));
            const suggestedMax = maxSellPrice * 1.001;

            setOptions(prevOptions => ({
                ...prevOptions,
                scales: {
                    ...prevOptions.scales,
                    x: {
                        ...prevOptions.scales.x,
                        suggestedMin,
                        suggestedMax,
                    }
                }
            }));

            setState({
                labels: orderBook.map(value => value.price),
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
        }
    }, [orderBook]);

    return <Line options={options} data={state} />;
}