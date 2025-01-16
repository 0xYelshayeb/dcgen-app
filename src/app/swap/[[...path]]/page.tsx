'use client';

import { useState, useMemo } from 'react';
import { Box, Flex, Stack, Select } from '@chakra-ui/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { arbitrum, base, mainnet } from 'wagmi/chains';
import { Token, DCA, MEME } from '@/constants/tokens';

import ProductInfo from '@/components/product-info';
import OverviewAndPerformance from '@/components/product-overview';
import QuickTradeContainer from '@/components/trade';

export default function SwapPage() {

  // 1. State for chosen product
  const [selectedProductName, setSelectedProductName] = useState(DCA.name);

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
            <ProductInfo product={selectedProductName} />
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
              <OverviewAndPerformance product={selectedProductName} />
            </Box>

            <Box flex="3.5" borderRadius="lg" mb={{ base: '4', lg: '0' }}>
              <QuickTradeContainer
                product={selectedProductName}
                onOverrideSupplyCap={undefined}
                onShowSupplyCap={undefined}
              />
              {/* Left side: the product selector */}
              <Select p={2}
                value={selectedProductName}
                onChange={(e) => setSelectedProductName(e.target.value)}
                fontWeight={600}
              >
                <option value={DCA.name}>DCgen Governance Core</option>
                <option value={MEME.name}>DCgen Meme</option>
              </Select>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Stack>
  );
}
