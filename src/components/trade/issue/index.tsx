import { useCallback, useEffect, useMemo, useState } from 'react'

import { useICColorMode } from '@/lib/styles/colors'

import { Box, Input, Text, Flex } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { colors } from '@/lib/styles/colors'

import { TradeButton } from '@/components/trade-button'
import { useApproval } from '@/lib/hooks/useApproval'
import { useIndexApproval } from '@/lib/hooks/useIndexApproval'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { navIssuanceModuleAddres } from '@/constants/contracts'
import { getNativeToken } from '@/lib/utils/tokens'
import { WETH } from '@/constants/tokens'
import { useNavIssuance } from '@/lib/hooks/useNavIssuance'
import { RethSupplyCapOverrides } from '@/components/supply'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'
import { useTradeButton } from './hooks/use-trade-button'
import { useWallet } from '@/lib/hooks/useWallet'
import { useNavIssue } from './hooks/use-issue'
import { ethers } from 'ethers'

// TODO: remove with new navigation
export type QuickTradeProps = {
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
}

export const Issue = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { isDarkMode } = useICColorMode()
  const { chainId } = useNetwork()
  const { address } = useWallet()

  // TODO: ?
  const [navAmountFormatted, setNavAmountFormatted] = useState('0')
  const [navAmount, setNavAmount] = useState('')
  const { executeNavIssue, isNavTransacting } = useNavIssuance()

  const {
    hasInsufficientFunds,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
  } = useNavIssue(WETH, navAmountFormatted)

  const {
    isApproved: isNavApproved,
    isApproving: isNavApproving,
    approve: navApprove,
  } = useApproval(WETH, navIssuanceModuleAddres, inputTokenAmountWei)

  const shouldApprove = !(getNativeToken(chainId)?.symbol === WETH.symbol);

  const navButtonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    shouldApprove,
    isNavApproved,
    isNavApproving,
    isNavTransacting,
    navAmountFormatted
  )

  const { buttonLabel: navButtonLabel, isDisabled: navIsDisabled } = useTradeButton(navButtonState)

  const onChangeNavAmount = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      setNavAmount(value);
      setNavAmountFormatted(value === '' ? '0' : value);
    }
  }

  const onNavIssue = useCallback(async () => {
    if (navButtonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (navButtonState === TradeButtonState.insufficientFunds) return

    if (!isNavApproved && shouldApprove) {
      await navApprove()
      return
    }

    if (navButtonState === TradeButtonState.default) {
      await executeNavIssue(ethers.utils.parseEther(navAmountFormatted))
    }
  }, [navButtonState, executeNavIssue, isNavApproved, navApprove, openConnectModal, shouldApprove])

  return (
    <Box>
      <Flex
        align='center'
        p='10px'
        shrink={0}
        gap={6}>
        <Input
          placeholder='0.0'
          value={navAmount}
          onChange={(e) => onChangeNavAmount(e.target.value)}
          marginBottom={2}
          marginTop={2}
        />
        <Text color={colors.icGray2} fontSize='12px' fontWeight='500'>
          WETH Balance: {inputTokenBalanceFormatted}
        </Text>
      </Flex>
      <TradeButton
        label={navButtonLabel}
        isDisabled={navIsDisabled}
        isLoading={isNavApproving}
        onClick={onNavIssue}
      />
    </Box>
  )
}
