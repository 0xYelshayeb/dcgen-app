import { MAINNET, ARBITRUM, BASE } from './chains'

export enum IndexType {
  thematic = 'thematic',
  leverage = 'leverage',
  yield = 'yield',
}

export interface Token {
  name: string
  symbol: string
  address: string | undefined
  polygonAddress: string | undefined
  optimismAddress: string | undefined
  sepoliaAddress: string | undefined
  arbitrumAddress: string | undefined
  baseAddress: string | undefined
  decimals: number
  // Url path for the token
  url: string
  image: string
  coingeckoId: string
  fees:
  | { streamingFee: string; mintFee?: string; redeemFee?: string }
  | undefined
  isDangerous: boolean
  indexTypes: IndexType[]
  defaultChain?: number
  isPerp?: boolean
}

export const ETH: Token = {
  name: 'Ethereum',
  symbol: 'ETH',
  image:
    'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  polygonAddress: '',
  optimismAddress: '',
  sepoliaAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  arbitrumAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  baseAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  decimals: 18,
  url: '',
  coingeckoId: 'ethereum',
  fees: undefined,
  isDangerous: false,
  indexTypes: [],
}

export const WETH: Token = {
  name: 'Wrapped Ether',
  symbol: 'WETH',
  image:
    'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  polygonAddress: '0xa5768A45A51d3525c345BD23F88fCFFcdFE5Cc55',
  optimismAddress: '0x4200000000000000000000000000000000000006',
  sepoliaAddress: '0xa5768A45A51d3525c345BD23F88fCFFcdFE5Cc55',
  arbitrumAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  baseAddress: '0x4200000000000000000000000000000000000006',
  decimals: 18,
  url: '',
  coingeckoId: 'weth',
  fees: undefined,
  isDangerous: false,
  indexTypes: [],
}

export const DCA: Token = {
  name: 'DCgen Governance Core',
  symbol: 'DCA',
  image: 'https://dcgen.finance/dcgen.png',
  address: '0x9Ef23Cd529AC9314427fC24323432f7f52b805FE',
  polygonAddress: '0x9Ef23Cd529AC9314427fC24323432f7f52b805FE',
  optimismAddress: undefined,
  sepoliaAddress: "0x9Ef23Cd529AC9314427fC24323432f7f52b805FE",
  arbitrumAddress: '0x9Ef23Cd529AC9314427fC24323432f7f52b805FE',
  baseAddress: undefined,
  decimals: 18,
  url: 'dpi',
  coingeckoId: 'defipulse-index',
  fees: undefined,
  isDangerous: false,
  indexTypes: [IndexType.thematic],
  defaultChain: ARBITRUM.chainId,
}

export const MEME: Token = {
  name: 'DCgen Meme',
  symbol: 'MEME',
  image: 'https://dcgen.finance/dcgen.png',
  address: '0x6b40F6cEddfe49B30FE87202c97D9E8Bd9B8af9C',
  polygonAddress: '0x9Ef23Cd529AC9314427fC24323432f7f52b805FE',
  optimismAddress: undefined,
  sepoliaAddress: "0x9Ef23Cd529AC9314427fC24323432f7f52b805FE",
  arbitrumAddress: '0x9Ef23Cd529AC9314427fC24323432f7f52b805FE',
  baseAddress: "0x6b40F6cEddfe49B30FE87202c97D9E8Bd9B8af9C",
  decimals: 18,
  url: 'dpi',
  coingeckoId: 'defipulse-index',
  fees: undefined,
  isDangerous: false,
  indexTypes: [IndexType.thematic],
  defaultChain: BASE.chainId,
}