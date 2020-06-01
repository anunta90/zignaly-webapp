import React, { useState, useRef, useCallback } from "react";
import "./Chart.scss";
import { Box } from "@material-ui/core";
import CustomToolip from "../../CustomTooltip";
import { Line } from "react-chartjs-2";
import { setPropTypes } from "recompose";

/**
 * @typedef {import('chart.js').ChartData} Chart.ChartData
 * @typedef {import('chart.js').ChartOptions} Chart.ChartOptions
 * @typedef {import('../../CustomTooltip/CustomTooltip').PosType} PosType
 */

/**
 * @typedef {Object} ChartData
 * @property {Array<Number>} values Chart values.
 * @property {Array<String>} labels Chart labels.
 */

/**
 * @typedef {Object} ChartColorOptions
 * @property {string} backgroundColor Background HTML color.
 * @property {string} borderColor Border HTML color.
 * @property {string} gradientColor1 Chart gradient color top.
 * @property {string} gradientColor2 Chart gradient color bottom.
 */

const MemoizedLine = React.memo(Line, (/* prevProps, nextProps */) => true);

/**
 * @typedef {Object} LineChartPropTypes
 * @property {ChartColorOptions} colorsOptions Chart colors.
 * @property {ChartData} chartData Chart dataset.
 * @property {function} tooltipFormat Function to format data based on selected value.
 */

/**
 * Provides a wrapper to display a chart.
 *
 * @param {LineChartPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const LineChart = (props) => {
  const { chartData, colorsOptions, tooltipFormat } = props;
  const chartRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState();
  const [pos, setPos] = useState(/** @type {PosType} */ (null));
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  const showTooltip = useCallback((tooltip) => {
    // if chart is not defined, return early
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    // hide the tooltip when chartjs determines you've hovered out
    if (tooltip.opacity === 0) {
      setTooltipVisibility(false);
      return;
    }

    // Set tooltip position.
    const position = chart.chartInstance.canvas.getBoundingClientRect();

    const left = position.left + window.pageXOffset + tooltip.caretX;
    const top = position.top + window.pageYOffset + tooltip.caretY;
    setPos({ top, left });

    // Set values for display of data in the tooltip
    const content = tooltipFormat(tooltip.dataPoints[0]);
    setTooltipContent(content);

    // Show tooltip
    setTooltipVisibility(true);
  }, []);

  /**
   * @type Chart.ChartData
   */
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "",
        data: chartData.values,
        backgroundColor: colorsOptions.backgroundColor,
        borderColor: colorsOptions.borderColor,
        fill: "start",
        pointHoverRadius: 7,
        pointHoverBorderWidth: 4,
        pointHoverBorderColor: "#5200c5",
        pointHoverBackgroundColor: "#fff",
      },
    ],
  };

  /**
   * @type Chart.ChartOptions
   */
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    hover: {
      intersect: false,
      mode: "nearest",
      animationDuration: 0,
    },
    tooltips: {
      mode: "nearest",
      intersect: false,
      //   position: "nearest",
      displayColors: false,
      enabled: false,
      custom: showTooltip,
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            display: false,
            fontFamily: "PlexSans-Bold",
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            display: false,
          },
          gridLines: {
            display: false,
            tickMarkLength: 0,
          },
        },
      ],
    },
    events: ["click", "touchstart", "touchmove"],
    // pointHitRadius: 10,
  };

  const plugins = [
    {
      id: "responsiveGradient",
      /**
       * @typedef {Object} ChartWithScales
       * @property {*} scales
       *
       * @typedef {Chart & ChartWithScales} ExtendedChart
       */

      /**
       * Fill chart with gradient on layout change.
       *
       * @param {ExtendedChart} chart Chart instance.
       * @returns {void}
       */
      afterLayout: (chart /* options */) => {
        let scales = chart.scales;
        let color = chart.ctx.createLinearGradient(0, scales["y-axis-0"].bottom, 0, 0);
        color.addColorStop(0, colorsOptions.gradientColor2);
        color.addColorStop(1, colorsOptions.gradientColor1);
        chart.data.datasets[0].backgroundColor = color;
      },
    },
  ];

  return (
    <Box className="chart">
      {isTooltipVisible && (
        <CustomToolip open={isTooltipVisible} pos={pos} title={tooltipContent} />
      )}

      <MemoizedLine data={data} options={options} plugins={plugins} ref={chartRef} />
    </Box>
  );
};

export default LineChart;
