import { BigNumber } from 'ethers'
import { useMemo } from 'react'

import { Token } from '@/constants/tokens'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTokenPrice } from '@/lib/hooks/use-token-price'
import { useWallet } from '@/lib/hooks/useWallet'
import { toWei } from '@/lib/utils'
import { PublicClient } from 'wagmi'

import {
  formattedFiat,
  getHasInsufficientFunds,
} from '../../../_shared/QuickTradeFormatter'

import { useFormattedBalance } from './use-formatted-balance'

export function useNavIssue(
  publicClient: PublicClient,
  inputToken: Token,
  inputTokenAmount: string,
) {
  const { address } = useWallet()
  const {
    balance,
    balanceFormatted: inputTokenBalanceFormatted,
    balanceWei: inputTokenBalance,
  } = useFormattedBalance(publicClient, inputToken, address ?? '')

  const inputTokenPrice = useTokenPrice(inputToken)
  const { chainId } = useNetwork()

  const inputTokenAmountUsd = useMemo(
    () => formattedFiat(parseFloat(inputTokenAmount), inputTokenPrice),
    [inputTokenAmount, inputTokenPrice]
  )

  const inputTokenAmountWei = useMemo(
    () => toWei(inputTokenAmount, inputToken.decimals),
    [inputToken, inputTokenAmount]
  )

  const hasInsufficientFunds = useMemo(
    () =>
      getHasInsufficientFunds(
        false,
        inputTokenAmountWei,
        BigNumber.from(balance.toString())
      ),
    [balance, inputTokenAmountWei]
  )

  return {
    hasInsufficientFunds,
    inputTokenAmountUsd,
    inputTokenAmountWei,
    inputTokenBalance,
    inputTokenBalanceFormatted,
    inputTokenPrice,
  }
}
