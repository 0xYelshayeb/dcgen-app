import { Box, Text, Flex, Badge } from '@chakra-ui/react';

import ChartSection from './ChartSection';
import InfoSection from './InfoSection.jsx';

interface ProductInfoProps {
  product: string;
}

const OverviewAndPerformance: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <Box background="#FCFCFC" p="24px" mb="24px">
      <Text fontSize="xl" fontWeight="bold" mb="4">
        DCgen Governance Core ($DCA)
      </Text>
      <Text fontSize="md" color="gray.600" mb="8">
        DCgen Governance Core tracks top governance tokens in the Ethereum ecosystem. Built on Arbitrum for lower fees and efficient trading.
      </Text>
      <ChartSection product={product}/>
      <InfoSection product={product}/>
    </Box>
  );
};

export default OverviewAndPerformance;
