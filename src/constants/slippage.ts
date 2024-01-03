import {
  SET
} from './tokens'

// Slippage default hard coded to 0.5%
export const slippageDefault = 0.5

export const slippageMap = new Map([
  [SET.symbol, 0.5],
])
