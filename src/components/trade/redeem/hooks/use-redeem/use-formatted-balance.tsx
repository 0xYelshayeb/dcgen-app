import { BigNumber } from 'ethers'
import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'

import { formattedBalance } from '../../../_shared/QuickTradeFormatter'
import { PublicClient } from 'wagmi'

export function useFormattedBalance(publicClient: PublicClient, token: Token, address?: string) {
  const balance = useBalance(publicClient, address ?? '', token.address)
  const balanceFormatted = formattedBalance(
    token,
    BigNumber.from(balance.toString())
  )
  const balanceWei = formatUnits(balance, token.decimals)
  return { balance, balanceWei, balanceFormatted }
}
