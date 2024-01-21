'use client';

import { useState } from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';

import {
  RethSupplyCapContainer,
  RethSupplyCapOverrides,
  SupplyCapState,
} from '@/components/supply';
import QuickTradeContainer from '@/components/trade';
import ProductInfo from '@/components/product-info';
import OverviewAndPerformance from '@/components/product-overview';

export default function SwapPage() {
  const [supplyCapOverrides, setSupplyCapOverrides] = useState<RethSupplyCapOverrides>();
  const [showSupplyCap, setShowSupplyCap] = useState(false);

  return (
    <Stack
      spacing={4} // Adjust spacing between stack items
      align="center"
      w="full"
    >
      <Box w="full">
        <ProductInfo />
      </Box>
      <Flex
        direction={{ base: 'column', lg: 'row' }} // Stack vertically on small screens, horizontally on large
        w="full"
        justify="space-between" // This will space the children as specified
        align={{ lg: 'flex-start' }} // Align items at the start of the cross axis
        gap={{ base: '4', lg: '8' }} // Adjust spacing between children
      >
        <Box flex="6.5" borderRadius="lg" mb={{ base: '4', lg: '0' }}>
          <OverviewAndPerformance />
        </Box>

        <Box flex="3.5" borderRadius="lg" mb={{ base: '4', lg: '0' }}>
          <QuickTradeContainer
            onOverrideSupplyCap={setSupplyCapOverrides}
            onShowSupplyCap={setShowSupplyCap}
          />
        </Box>
      </Flex>

      {showSupplyCap && (
        <Box h='100%' w={['100%', '100%', '500px', '360px']}>
          <RethSupplyCapContainer
            state={SupplyCapState.capWillExceed}
            overrides={supplyCapOverrides}
          />
        </Box>
      )}
    </Stack>
  );
}
