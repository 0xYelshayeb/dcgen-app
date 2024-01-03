'use client'

import { useState } from 'react'

import { Box, Flex } from '@chakra-ui/react'

import {
  RethSupplyCapContainer,
  RethSupplyCapOverrides,
  SupplyCapState,
} from '@/components/supply'
import QuickTradeContainer from '@/components/trade'
import TransactionContainer from '@/components/admin/TransactionContainer'

export default function AdminPage() {
  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      mx='auto'
      height='inherit'
    >
      <Box mb={[4, 4, 4, 12]} mr={4} w={['inherit', '500px']}>
        <TransactionContainer />
      </Box>
    </Flex>
  )
}
