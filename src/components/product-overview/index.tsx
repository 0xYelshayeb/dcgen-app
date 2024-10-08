import { Box, Text, Flex, Badge } from '@chakra-ui/react';

import ChartSection from './ChartSection.jsx';
import InfoSection from './InfoSection.jsx';

const OverviewAndPerformance = () => {
  return (
    <Box background="#FCFCFC" p="24px" mb="24px">
      <Text fontSize="lg" fontWeight="bold" mb="4">
        DCgen Governance Core ($DCA)
      </Text>
      <Text fontSize="md" color="gray.600" mb="8">
        DCG is a structured product that tracks the performance of the leading governance tokens on Ethereum. There are no fees to the product besides potential gas fees. The product is built upon conducted research and uses SetProtocol&apos;s smart contract infrastructure. Buy on Arbitrum.
      </Text>
      <ChartSection />
      <InfoSection />
    </Box>
  );
};

export default OverviewAndPerformance;
