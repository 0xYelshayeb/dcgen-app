import { useCallback, useState } from 'react'
import { Box, Input, Text, Flex, Heading, Divider } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/lib/hooks/useWallet'
import { useRedemption } from '@/lib/hooks/useRedemption'
import { BigNumber, ethers } from 'ethers'
import { useColorStyles } from '@/lib/styles/colors'
import { SETTOKEN } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { IssuanceModuleAddres } from '@/constants/contracts'
import { useRedeem } from './hooks/use-redeem'
import { TradeButton } from '@/components/trade-button'
import { useTradeButton } from './hooks/use-trade-button'
import { colors } from '@/lib/styles/colors'

import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'

export const Redeem = () => {
  const { styles } = useColorStyles()
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useWallet()
  const { executeRedeem, isTransacting } = useRedemption()
  const [amount, setAmount] = useState('')
  const [formattedAmount, setFormattedAmount] = useState('0')

  const {
    hasInsufficientFunds,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
  } = useRedeem(SETTOKEN, formattedAmount)

  const {
    isApproved,
    isApproving,
    approve: approve,
  } = useApproval(SETTOKEN, IssuanceModuleAddres, inputTokenAmountWei)

  const navButtonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    true,
    isApproved,
    isApproving,
    isTransacting,
    formattedAmount
  )

  const { buttonLabel: navButtonLabel, isDisabled: navIsDisabled } = useTradeButton(navButtonState)

  const handleInputChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      setAmount(value);
      setFormattedAmount(value === '' ? '0' : value);
    }
  }

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal()
    }
  }

  const onRedeem = useCallback(async () => {
    if (navButtonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (navButtonState === TradeButtonState.insufficientFunds) return

    if (!isApproved) {
      await approve();
      return
    }

    if (navButtonState === TradeButtonState.default) {
      await executeRedeem(ethers.utils.parseEther(formattedAmount))
    }
  }, [navButtonState, executeRedeem, isApproved, approve, openConnectModal])

  return (
    <Box>
      <Flex
        shrink={0}
        direction="column">
        <Heading fontSize='16px' padding={3}>
          SET Balance:
        </Heading>
        <Text padding={3} paddingTop={0}>
          {inputTokenBalanceFormatted}
        </Text>
        <Input
          marginTop={0}
          placeholder='0.0'
          value={amount}
          onChange={(e) => handleInputChange(e.target.value)}
          mb={2}
          border="none"
          background="white"
          borderRadius={'8px'}
        />
      </Flex>
      <TradeButton
        label={navButtonLabel}
        isDisabled={navIsDisabled}
        isLoading={isApproving}
        onClick={onRedeem}
      />
    </Box>
  )
}
