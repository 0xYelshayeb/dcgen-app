import { slippageMap } from '@/constants/slippage'

export function getSlippageOverrideOrNull(
  tokenSymbol: string,
  inputOutputTokenSymbol: string
): number | null {
  return slippageMap.get(tokenSymbol) ?? 0
}

export function selectSlippage(
  slippage: number,
  indexSymbol: string,
  inputOutputTokenSymbol: string
): number {
  const slippageOverrride = getSlippageOverrideOrNull(
    indexSymbol,
    inputOutputTokenSymbol
  )
  if (slippageOverrride && slippage < slippageOverrride)
    return slippageOverrride
  if (slippageOverrride && slippage > slippageOverrride) return slippage
  return slippageOverrride ?? slippage
}
