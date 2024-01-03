import {
  ETH,
  WETH,
  SET,
  COMPONENT,
  COMPONENT1,
  COMPONENT2,
  COMPONENT3,
  COMPONENT4,
  COMPONENT5,
  COMPONENT6,
  COMPONENT7,
  COMPONENT8,
  COMPONENT9,
  COMPONENT10,
} from '@/constants/tokens'

/**
 * Currencies
 */

// Add new currencies here as well to fetch all balances
export const currencies = [
  WETH,
]

export const CurrencyTokens = [ETH, WETH]

/**
 * Lists
 */

const isDevEnv =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'index-app-staging'
// Keeping a separate list for dev/staging and production to be able to include
// indices that have not been released yet.
const indexNames = isDevEnv
  ? [
      SET,
      COMPONENT
    ]
  : [
      SET,
      COMPONENT
    ]

const components = [
  COMPONENT,
  COMPONENT1,
  COMPONENT2,
  COMPONENT3,
  COMPONENT4,
  COMPONENT5,
  COMPONENT6,
  COMPONENT7,
  COMPONENT8,
  COMPONENT9,
  COMPONENT10,
]

export const componentTokens = components;

export const indexNamesMainnet = indexNames;

// FlashMint specific lists
export const flashMintIndexesMainnetRedeem = indexNames;

export default indexNames
