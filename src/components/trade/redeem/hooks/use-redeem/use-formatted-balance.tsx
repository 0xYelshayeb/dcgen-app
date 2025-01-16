import { BigNumber } from 'ethers'
import { formatUnits } from '@ethersproject/units'

import { Token } from '@/constants/tokens'
import { useBalance } from '@/lib/hooks/use-balance'

import { formattedBalance } from '../../../_shared/QuickTradeFormatter'
import { PublicClient } from 'wagmi'

export function useFormattedBalance(publicClient: PublicClient, token: Token, address?: string) {

  const chain = publicClient.chain;
  switch (chain.id) {
    case 1:
      token.address = token.address;
      break;
    case 42161:
      token.address = token.arbitrumAddress;
      break;
    case 8453:
      token.address = token.baseAddress;
      break;
  }
  const balance = useBalance(publicClient, address ?? '', token.address);
  const balanceFormatted = formattedBalance(
    token,
    BigNumber.from(balance.toString())
  );
  const balanceWei = formatUnits(balance, token.decimals);
  return { balance, balanceWei, balanceFormatted };
}
