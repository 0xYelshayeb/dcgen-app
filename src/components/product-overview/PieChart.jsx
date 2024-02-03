import React from 'react';
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart';
import { Box } from '@chakra-ui/react';

const PieChart = ({ tokens }) => {

    const CustomLabel = ({ x, y, dx, dy, dataEntry }) => {
        if (dataEntry.value <= 7) {
            return null;
        }

        const text = `${dataEntry.value.toFixed(2)}%`;
        const textLength = text.length * 8; // Approximate width of each character
        const rectWidth = textLength / 2; // Add some padding

        return (
            <g>
                <rect
                    x={x + dx - rectWidth / 2} // Center the rectangle on the x coordinate
                    y={y + dy - 5} // Center the rectangle on the y coordinate
                    width={rectWidth} // Width of the rectangle based on text length
                    height="10" // Height of the rectangle
                    rx="5" // Border radius on x-axis for rounded corners
                    ry="5" // Border radius on y-axis for rounded corners
                    fill={dataEntry.color} // Background color
                    stroke="#fff"
                    strokeWidth="0.3"
                />
                <text
                    x={x + dx}
                    y={y + dy}
                    fill="#fff" // Text color
                    textAnchor="middle" // Horizontally center the text
                    dominantBaseline="middle" // Vertically center the text
                    fontSize="4" // Font size
                    fontWeight="bold"
                >
                    {text}
                </text>
            </g>
        );
    };

    // Generate chart data with colors and labels
    const chartData = tokens.map((token) => ({
        title: token.Name,
        value: token['Allocation %'],
        color: token['Color'],
        label: token.Name === 'Others' || `${token['Allocation %'].toFixed(2)}%`
    }));

    return (
        <Box width="80%" height="auto">
            <MinimalPieChart
                data={chartData}
                lineWidth={15} // Adjust to the desired thickness
                paddingAngle={0.3} // Adjust the space between segments if necessary
                label={({ x, y, dx, dy, dataEntry }) => (
                    <CustomLabel x={x} y={y} dx={dx} dy={dy} dataEntry={dataEntry} />
                )}
                labelPosition={85}
            />
        </Box>
    );
};

export default PieChart;
