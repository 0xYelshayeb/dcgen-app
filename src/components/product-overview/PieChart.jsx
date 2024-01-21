import React from 'react';
import { PieChart as MinimalPieChart } from 'react-minimal-pie-chart';
import { Box } from '@chakra-ui/react';

const PieChart = ({ tokens }) => {

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    // Function to get random color from the array
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const chartData = tokens.map((token) => ({
        title: token.Name,
        value: token['Allocation %'],
        color: getRandomColor(), // Assign a random color
    }));

    return (
        <Box width="70%" height="auto">
            <MinimalPieChart
                data={chartData}
                lineWidth={15} // This should be adjusted to match the thickness of the pie chart in your image
                paddingAngle={0} // Adjust the space between segments if necessary
                // rounded // If you want rounded edges on the segments
                label={({ dataEntry }) => dataEntry.value.toFixed(2) + '%'}
                labelStyle={{
                    fontSize: '5px',
                }} />
        </Box>
    );
};

export default PieChart;
