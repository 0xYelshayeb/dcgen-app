// src/components/MyChart.js
import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import AccessibilityModule from 'highcharts/modules/accessibility';

// AccessibilityModule(Highcharts);

const options = (chartData, timeFrame, onUpdateValues) => { // Make options a function that takes chartData and timeFrame

  let labelFormat;
  let screenWidth = 800;
  let adjustedLineWidth = 2; // Default line width

  if (typeof window !== 'undefined') {
    screenWidth = window.innerWidth;
    if (screenWidth <= 834) {
      adjustedLineWidth = 1; // Make the line thinner for narrow screens
    }
  }
  //value for reference line (dashed) in chart
  const referenceValue = (chartData.length > 0 && chartData[0].length > 1) ? chartData[0][1] : null; // Check to ensure chartData has at least one data point with a y-value before attempting to access it, to prevent runtime errors

  if (screenWidth <= 834) { // For screens narrower than 768px
    adjustedLineWidth = 2; // Make the line thinner
  }

  switch (timeFrame) {
    case 'MAX':
      labelFormat = '{value:%Y}'; // Just the year
      break;
    case '1Y':
      labelFormat = '{value:%b %y}'; // Short version of month and year
      break;
    case '6M':
      labelFormat = '{value:%b %y}'; // Same as 1Y
      break;
    case '3M':
      labelFormat = '{value:%b %y}'; // Same as 1Y
      break;
    default:
      labelFormat = '{value:%d.%m.%Y}'; // Default format
  }

  return {

    accessibility: {
      enabled: true
    },
    chart: {
      backgroundColor: null, // no background
      margin: [0, 0, 50, 0], // [top, right, bottom, left]
      ariaLabel: 'Chart containing Ethereum Index Data',
    },
    title: {
      text: ''
    },
    yAxis: {
      title: {
        text: null,
      },
      lineWidth: 0,
      labels: {
        enabled: false,
      },
      gridLineWidth: 1,
      gridLineColor: '#EEEEEE',

      plotLines: [{
        value: referenceValue,  // y-position of the line
        color: '#D0D1D3',  // Color of the line
        dashStyle: 'Dash',  // Style of the line
        width: 2,  // Width of the line
        zIndex: 1,  // zIndex to ensure the line is drawn behind the series
    }]    
    },
    xAxis: {
      type: 'datetime', // x-axis as dates
      title: null,
      labels: {
        format: labelFormat,
        style: {
          color: '#000',
        },
      },
      tickPositioner: function(min, max) {
        const positions = [];
        const tickCount = 5; // You can change this to 4 or 6 if you prefer
        const interval = (max - min) / (tickCount - 1);
    
        for (let i = 0; i < tickCount; i++) {
          positions.push(min + (interval * i));
        }
    
        // Sort positions so they appear in ascending order on the axis
        positions.sort((a, b) => a - b);
    
        return positions;
      },
      crosshair: {
        dashStyle: 'Solid',
        width: 1,
        color: '#233DFF'
      },
      lineWidth: 0, // remove x-axis line
      tickWidth: 0,
    },
    legend: {
      enabled: false, // remove the legend
    },
    series: [{
      name: 'Index', // series name
      data: chartData,
      color: '#233DFF', // white line
      lineWidth: adjustedLineWidth, // set to 1 for a sharper line
      shadow: {
        width: 2,  // adjust to your preference for thickness
        offsetX: 0,
        offsetY: 0,
        color: '#FFF'  // same color as the line
      },
      marker: {
        enabled: false, // no dots on each data point
      },
    }],
    credits: {
      enabled: false, // This line disables the Highcharts.com label
    },
    tooltip: {
      useHTML: true, // Allows the use of HTML in the tooltip
      borderRadius: 0,  // Removes rounded corners by setting the border radius to 0
      backgroundColor: '#233DFF',  // Sets the background color of the tooltip
      style: {
          color: '#FFFFFF'  // Sets the text color in the tooltip
      },
      shadow: false,  // Removes the shadow effect
      padding: 8,  // Adds padding inside the tooltip
      formatter: function () {
        const { point } = this;
        const indexValue = parseFloat(point.y).toFixed(2);
        const initialIndexValue = parseFloat(chartData[0][1]).toFixed(2);
        const returnPercentage = (((indexValue - initialIndexValue) / initialIndexValue) * 100).toFixed(2);
        onUpdateValues(indexValue, returnPercentage);  // update the values in the parent component
        return `
        <div style="text-align: center; padding-left: 8px; padding-right: 8px; font-weight: 600">
          <div>${Highcharts.dateFormat('%d %b %y', point.x)}</div>
        </div> 
        `;
      },
      positioner: function(labelWidth, labelHeight, point) { // Showing label while interacting in the top of the vertical line
          // Get the chart layout values to calculate edges
          const plotLeft = this.chart.plotLeft;
          const plotWidth = this.chart.plotWidth;
          const tooltipX = point.plotX + plotLeft - labelWidth / 2;
        
          // Check if the tooltip would overflow the left edge of the chart
          let adjustedX = tooltipX < plotLeft ? plotLeft : tooltipX;
        
          // Check if the tooltip would overflow the right edge of the chart
          adjustedX = tooltipX + labelWidth > plotLeft + plotWidth ? plotLeft + plotWidth - labelWidth : adjustedX;
        
          return { x: adjustedX, y: 0 };  // Adjust y to 10 to create a gap between the tooltip and the crosshair
      }
    }  
  };
}

function MyChart({ chartData, timeFrame, onUpdateValues }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const handleMouseLeave = () => {
      const lastDataPoint = chartData[chartData.length - 1];
      const indexValue = lastDataPoint ? parseFloat(lastDataPoint[1]).toFixed(2) : null;
      const initialIndexValue = parseFloat(chartData[0][1]).toFixed(2);
      const returnPercentage = (((indexValue - initialIndexValue) / initialIndexValue) * 100).toFixed(2);
      onUpdateValues(indexValue, returnPercentage);
    };

    const chartContainer = chartContainerRef.current;
    if (chartContainer) {
      chartContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (chartContainer) {
        chartContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [chartData, onUpdateValues]);
  
  return (
    <div ref={chartContainerRef} className="chart-container">
      <HighchartsReact
        highcharts={Highcharts}
        options={options(chartData, timeFrame, onUpdateValues)}
      />
    </div>
  );
}

export default MyChart;
