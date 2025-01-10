'use client';

import { useState } from 'react';
import { Box, Flex, Stack, Select } from '@chakra-ui/react';

import {
  RethSupplyCapOverrides,
} from '@/components/supply';
import QuickTradeContainer from '@/components/trade';
import ProductInfo from '@/components/product-info';
import OverviewAndPerformance from '@/components/product-overview';

export default function SwapPage() {
  const [supplyCapOverrides, setSupplyCapOverrides] = useState<RethSupplyCapOverrides>();
  const [showSupplyCap, setShowSupplyCap] = useState(false);

  // 1. State for chosen product
  const [selectedProduct, setSelectedProduct] = useState('DCgen Governance Core');

  return (
    <Stack
      spacing={4}       // Adjust spacing between stack items
      align="center"
      w="full"
    >
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        w="full"
        align="flex-start"
        gap={{ base: '4', lg: '8' }}
      >

        {/* Right side: Main page content */}
        <Box flex="4">
          {/* 2. Pass the selected product into ProductInfo */}
          <Box w="full" mb={{ base: '4', lg: '0' }}>
            <ProductInfo product={selectedProduct} />
          </Box>

          {/* 3. Overview & Performance + QuickTrade side-by-side */}
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            w="full"
            justify="space-between"
            align={{ lg: 'flex-start' }}
            gap={{ base: '4', lg: '8' }}
          >

            <Box flex="6.5" borderRadius="lg" mb={{ base: '4', lg: '0' }}>
              <OverviewAndPerformance product={selectedProduct} />
            </Box>

            <Box flex="3.5" borderRadius="lg" mb={{ base: '4', lg: '0' }}>
              <QuickTradeContainer
                product={selectedProduct}
                onOverrideSupplyCap={setSupplyCapOverrides}
                onShowSupplyCap={setShowSupplyCap}
              />
              {/* Left side: the product selector */}
              <Select p={2}
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                fontWeight={600}
              >
                <option value="DCgen Governance Core">DCgen Governance Core</option>
                <option value="DCgen Meme">DCgen Meme</option>
              </Select>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Stack>
  );
}
