import { useMemo } from 'react'
import { Token, DCA, WETH } from '@/constants/tokens'

import { TradeButtonState } from './use-trade-button-state'

export const useTradeButton = (
  buttonState: TradeButtonState,
  sellToken: Token,
  buyToken: Token
) => {
  /**
   * Returns the correct trade button label according to different states.
   * @returns string label for trade button
   */

  const isIssuing = sellToken.symbol === WETH.symbol && buyToken.symbol === DCA.symbol
  const isRedeeming = sellToken.symbol === DCA.symbol && buyToken.symbol === WETH.symbol

  const buttonLabel = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
        return 'Approve'
      case TradeButtonState.approving:
        return 'Approving...'
      case TradeButtonState.connectWallet:
        return 'Connect Wallet'
      case TradeButtonState.enterAmount:
        return 'Enter an amount'
      case TradeButtonState.fetchingError:
        return 'Try again'
      case TradeButtonState.insufficientFunds:
        return 'Insufficient funds'
      case TradeButtonState.wrongNetwork:
        return 'Wrong Network'
      case TradeButtonState.loading:
        if (isIssuing) return 'Issuing...'
        if (isRedeeming) return 'Redeeming...'
        return 'Swapping...'
      default:
        if (isIssuing) return 'Issue'
        if (isRedeeming) return 'Redeem'
        return 'Swap'
    }
  }, [buttonState])

  const isDisabled = useMemo(() => {
    switch (buttonState) {
      case TradeButtonState.approve:
      case TradeButtonState.connectWallet:
      case TradeButtonState.fetchingError:
        return false
      case TradeButtonState.approving:
      case TradeButtonState.enterAmount:
      case TradeButtonState.insufficientFunds:
      case TradeButtonState.loading:
      case TradeButtonState.wrongNetwork:
        return true
      default:
        return false
    }
  }, [buttonState])

  return {
    buttonLabel,
    isDisabled,
  }
}
