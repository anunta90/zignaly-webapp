import React, { useEffect } from 'react';
import './Chart.sass';
import { Box } from '@material-ui/core';
import {Chart} from 'chart.js';

const GenericChart = (props) => {

    useEffect(() => {
        let ctx = document.getElementById(props.id).getContext("2d");
        let background = ctx.createLinearGradient(0, 0, 0, 500);
        background.addColorStop(1, "rgba(216, 216, 216, .1)");
        background.addColorStop(0, "#a946f6");
        let border = "#770fc8";
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["", "", "", "", "", "", "", ""],
                datasets: [
                    {
                        label: "Equity",
                        data: [100, 137, 161, 120, 200, 100, 137, 161],
                        backgroundColor: background,
                        borderColor: border,
                    }
                ]
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                },
                elements: {
                    point:{
                        radius: 0
                    },
                    line: {
                        tension: 0
                    },
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false,
                            fontFamily: "PlexSans-Bold",
                        },
                        gridLines: {
                            display: false,
                            tickMarkLength: 0,
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                            tickMarkLength: 0,
                        }
                    }]
                }
            }
        });
    }, [])

    return (
        <Box className="chart">
            {props.children}
        </Box>
    )
}

export default GenericChart;