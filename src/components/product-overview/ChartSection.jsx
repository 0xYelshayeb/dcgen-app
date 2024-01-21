import React, { useState, useEffect, useRef} from "react";
import axios from 'axios';
import MyChart from "./MyChart";
import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

const TimeFrameButton = ({ text, isSelected, onClick }) => {
  return (
    <Button
      size="sm"
      onClick={onClick}
      bg={isSelected ? "#233DFF" : "gray.200"}
      color={isSelected ? "white" : "black"}
      _hover={{
        bg: isSelected ? "#233DFF" : "gray.300",
      }}
      _active={{
        bg: isSelected ? "#233DAA" : "gray.400",
      }}
      borderRadius="0"
      border="none"
      fontWeight="bold"
    >
      {text}
    </Button>
  );
};

const ChartSection = () => {

  const chartRef = useRef(null);
  const [currentIndexValue, setCurrentIndexValue] = useState(null);
  const [currentReturn, setCurrentReturn] = useState(null);
  const [timeFrame, setTimeFrame] = useState('3M');
  const [chartData, setChartData] = useState([]);
  const [changeClass, setChangeClass] = useState('positive');  // color-coded text

  const updateValues = (indexValue, returnPercentage) => {
    setCurrentIndexValue(indexValue);
    setCurrentReturn(returnPercentage);
    setChangeClass(returnPercentage >= 0 ? 'positive' : 'negative');
  };

  useEffect(() => {
    const chartElement = chartRef.current;

    const preventScroll = (e) => {
      e.preventDefault();
    };

    if (chartElement) {
      chartElement.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (chartElement) {
        chartElement.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.dcgen.finance/timeSeries?timeframe=${timeFrame}`);
        setChartData(response.data);
        if (response.data && response.data.length > 0) {
          const firstValue = response.data[0][1];
          const lastValue = response.data[response.data.length - 1][1];
          const difference = lastValue - firstValue;
          const percentChange = (difference / firstValue) * 100;
          updateValues(lastValue.toFixed(2), isNaN(percentChange) ? 0 : parseFloat(percentChange.toFixed(2)));
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  const firstValue = chartData.length > 0 ? chartData[0][1] : 0;
  const lastValue = chartData.length > 0 ? chartData[chartData.length - 1][1] : 0;
  const difference = lastValue - firstValue;
  const percentChange = (difference / firstValue) * 100;

  return (
    <Box>
      <VStack spacing align="stretch">
        <Text fontSize="xl" fontWeight="bold" color="gray">Performance</Text>
        <Flex justifyContent="space-between" paddingTop={3}>
          <Box>
            <Heading as="h2" size="xl">
              $ {currentIndexValue || lastValue.toFixed(2)}
            </Heading>
            <Text fontSize="md" fontWeight="bold">Price</Text>
          </Box>
          <Box>
            <Heading as="h2" size="xl" color={changeClass === "positive" ? "green.500" : "red.500"}>
              {currentReturn || (isNaN(percentChange) ? "---" : percentChange.toFixed(2))}%
            </Heading>
            <Text fontSize="md" fontWeight="bold">{timeFrame === 'MAX' ? "Overall" : timeFrame} Return</Text>
          </Box>
        </Flex>
      </VStack>
      <Box paddingTop={5}>
        <Flex gap={3}>
          {['3M', '6M', '1Y', 'MAX'].map((frame) => (
            <TimeFrameButton
              key={frame}
              text={frame}
              isSelected={timeFrame === frame}
              onClick={() => setTimeFrame(frame)}
            />
          ))}
        </Flex>
        <Box>
          <MyChart chartData={chartData} timeFrame={timeFrame} onUpdateValues={updateValues} />
        </Box>
      </Box>
    </Box>
  );
}

export default ChartSection;