import { MAINNET, OPTIMISM, POLYGON, SEPOLIA } from '@/constants/chains'
import { CurrencyTokens } from '@/constants/tokenlists'
import {
  SET,
  ETH,
  Token,
  WETH,
  MATIC
} from '@/constants/tokens'

export function getAddressForToken(
  token: Token,
  chainId: number | undefined
): string | undefined {
  switch (chainId) {
    case MAINNET.chainId:
      return token.address
    case OPTIMISM.chainId:
      return token.optimismAddress
    case POLYGON.chainId:
      return token.polygonAddress
    case SEPOLIA.chainId:
      return token.sepoliaAddress
    default:
      return undefined
  }
}

export function getTokenforAddress(
  address: string,
  chainId: number | undefined
): Token {
  return CurrencyTokens.find((token) => token.address == address) ?? ETH
}

/**
 * Gets the list of currency tokens for the selected chain.
 * @returns Token[] list of tokens
 */
export function getCurrencyTokens(chainId: number | undefined): Token[] {
  switch (chainId) {
    case MAINNET.chainId:
      return CurrencyTokens
    default:
      return CurrencyTokens
  }
}

/**
 * Gets the supported currency tokens for the given index.
 * @returns Token[] list of supported currency tokens
 */
export function getCurrencyTokensForIndex(
  index: Token,
  chainId: number,
  isMinting: boolean
): Token[] {
  const currencyTokens = getCurrencyTokens(chainId)
  return currencyTokens
}

export function getNativeToken(chainId: number | undefined): Token | null {
  switch (chainId) {
    case MAINNET.chainId:
      return ETH
    case OPTIMISM.chainId:
      return ETH
    case POLYGON.chainId:
      return MATIC
    case SEPOLIA.chainId:
      return ETH
    default:
      return null
  }
}

export function isAvailableForFlashMint(token: Token): boolean {
  return true;
}

export function isAvailableForSwap(token: Token): boolean {
  return true;
}

export function isLeveragedToken(token: Token): boolean {
  return false
}

export const isNativeCurrency = (token: Token, chainId: number): boolean => {
  const nativeCurrency = getNativeToken(chainId)
  if (!nativeCurrency) return false
  return token.symbol === nativeCurrency.symbol
}

export function isPerpToken(token: Token): boolean {
  return token.isPerp ? true : false
}
