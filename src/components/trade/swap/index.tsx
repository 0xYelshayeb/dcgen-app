import { useCallback, useEffect, useMemo, useState } from 'react'

import { colors, useICColorMode } from '@/lib/styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { TradeButton } from '@/components/trade-button'
import { Token, DCA, WETH } from '@/constants/tokens'
import { useApproval } from '@/lib/hooks/useApproval'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { useTradeButton } from './hooks/use-trade-button'
import { useWallet } from '@/lib/hooks/useWallet'
import { useRedemption } from '@/lib/hooks/useRedemption'
import { useNavIssue } from '../issue/hooks/use-issue'
import { useRedeem } from '../redeem/hooks/use-redeem'
import { useNavIssuance } from '@/lib/hooks/useNavIssuance'
import { navIssuanceModuleAddres } from '@/constants/contracts'
import { getNativeToken } from '@/lib/utils/tokens'
import { isValidTokenInput } from '@/lib/utils'

import { RethSupplyCapOverrides } from '@/components/supply'
import { TradeInputSelector } from './components/trade-input-selector'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'

// TODO: remove with new navigation
export type QuickTradeProps = {
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
}

export const Swap = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { isDarkMode } = useICColorMode()
  const { chainId } = useNetwork()
  const { address } = useWallet()

  const [sellToken, setSellToken] = useState<Token>(WETH)
  const [buyToken, setBuyToken] = useState<Token>(DCA)

  const { executeRedeem, isTransacting: isRedeeming } = useRedemption()
  const { executeNavIssue, isNavTransacting: isIssuing } = useNavIssuance()

  const [isTransacting, setIsTransacting] = useState(false)
  const [inputTokenAmount, setInputTokenAmount] = useState('')
  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')
  const [outputTokenAmountFormatted, setOutputTokenAmountFormatted] = useState('0')

  // State variables for balances and other data
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [hasInsufficientFunds, setHasInsufficientFunds] = useState(false)
  const [inputTokenBalanceFormatted, setInputTokenBalanceFormatted] = useState('0')
  const [outputTokenBalanceFormatted, setOutputTokenBalanceFormatted] = useState('0')
  const [inputTokenAmountUsd, setInputTokenAmountUsd] = useState('0')

  // Fetch data for WETH
  const {
    hasInsufficientFunds: hasInsufficientFundsWeth,
    inputTokenAmountUsd: inputTokenAmountUsdWeth,
    inputTokenAmountWei: inputTokenAmountWeiWeth,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedWeth,
  } = useNavIssue(WETH, inputTokenAmountFormatted)

  // Fetch data for DCA
  const {
    hasInsufficientFunds: hasInsufficientFundsDca,
    inputTokenAmountUsd: inputTokenAmountUsdDca,
    inputTokenAmountWei: inputTokenAmountWeiDca,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedDca,
  } = useRedeem(DCA, inputTokenAmountFormatted)

  // Approval hooks
  const {
    isApproved: isApprovedWeth,
    isApproving: isApprovingWeth,
    approve: onApproveWeth,
  } = useApproval(WETH, navIssuanceModuleAddres, inputTokenAmountWeiWeth)

  const {
    isApproved: isApprovedDca,
    isApproving: isApprovingDca,
    approve: onApproveDca,
  } = useApproval(DCA, navIssuanceModuleAddres, inputTokenAmountWeiDca)

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(chainId)
    const isNativeToken = nativeToken?.symbol === sellToken.symbol
    return !isNativeToken
  }, [chainId, sellToken])

  const buttonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    isTransacting,
    sellTokenAmount
  )

  const { buttonLabel, isDisabled } = useTradeButton(buttonState)

  const resetTradeData = () => {
    setInputTokenAmountFormatted('0')
    setInputTokenAmountUsd('0')
    setSellTokenAmount('0')
    setOutputTokenAmountFormatted('0')
  }

  useEffect(() => {
    // Update state variables based on the current sellToken and buyToken
    if (sellToken.symbol === WETH.symbol) {
      // We are selling WETH to buy DCA
      setIsApproved(isApprovedWeth)
      setIsApproving(isApprovingWeth)
      setHasInsufficientFunds(hasInsufficientFundsWeth)
      setInputTokenBalanceFormatted(inputTokenBalanceFormattedWeth)
      setOutputTokenBalanceFormatted(inputTokenBalanceFormattedDca)
      setInputTokenAmountUsd(inputTokenAmountUsdWeth)
    } else if (sellToken.symbol === DCA.symbol) {
      // We are selling DCA to buy WETH
      setIsApproved(isApprovedDca)
      setIsApproving(isApprovingDca)
      setHasInsufficientFunds(hasInsufficientFundsDca)
      setInputTokenBalanceFormatted(inputTokenBalanceFormattedDca)
      setOutputTokenBalanceFormatted(inputTokenBalanceFormattedWeth)
      setInputTokenAmountUsd(inputTokenAmountUsdDca)
    }
    // Update sellTokenAmount and outputTokenAmountFormatted
    setSellTokenAmount(inputTokenAmountFormatted)
    setOutputTokenAmountFormatted(inputTokenAmountFormatted) // Assuming 1:1 rate
  }, [
    sellToken,
    buyToken,
    inputTokenAmountFormatted,
    isApprovedWeth,
    isApprovingWeth,
    hasInsufficientFundsWeth,
    inputTokenBalanceFormattedWeth,
    inputTokenAmountUsdWeth,
    isApprovedDca,
    isApprovingDca,
    hasInsufficientFundsDca,
    inputTokenBalanceFormattedDca,
    inputTokenAmountUsdDca,
  ])

  useEffect(() => {
    setIsTransacting(isRedeeming || isIssuing)
  }, [isRedeeming, isIssuing])


  const onChangeInputTokenAmount = (token: Token, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      setInputTokenAmount(value);
      setInputTokenAmountFormatted(value === '' ? '0' : value);
    }
    setSellTokenAmount(value || '')
    // Assuming a 1:1 exchange rate for simplicity
    setOutputTokenAmountFormatted(value || '0')
  }

  const onClickTradeButton = useCallback(async () => {
    if (buttonState === TradeButtonState.connectWallet) {
      if (openConnectModal) {
        openConnectModal()
      }
      return
    }

    if (buttonState === TradeButtonState.insufficientFunds) return

    if (!isApproved && shouldApprove) {
      if (sellToken.symbol === WETH.symbol) {
        await onApproveWeth()
      } else if (sellToken.symbol === DCA.symbol) {
        await onApproveDca()
      }
      return
    }

    if (buttonState === TradeButtonState.default) {
      if (sellToken.symbol === WETH.symbol) {
        await executeNavIssue(inputTokenAmountWeiWeth)
      } else if (sellToken.symbol === DCA.symbol) {
        await executeRedeem(inputTokenAmountWeiDca)
      }
    }
  }, [
    buttonState,
    isApproved,
    onApproveWeth,
    onApproveDca,
    shouldApprove,
    sellToken,
    executeNavIssue,
    executeRedeem,
    inputTokenAmountWeiWeth,
    inputTokenAmountWeiDca,
    openConnectModal,
  ])

  const onSwitchTokens = () => {
    const temp = sellToken
    setSellToken(buyToken)
    setBuyToken(temp)
    resetTradeData()
  }

  return (
    <Box>
      <Flex direction='column' m='4px 0 6px'>
        <TradeInputSelector
          config={{ isReadOnly: false }}
          balance={inputTokenBalanceFormatted}
          caption='You pay'
          formattedFiat={inputTokenAmountUsd}
          selectedToken={sellToken}
          selectedTokenAmount={inputTokenAmount}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={() => {}}
          onSelectToken={() => {}}
        />
        <Box h='6px' alignSelf={'center'}>
          <IconButton
            background={colors.icWhite}
            margin={'-16px 0 0 0'}
            aria-label='switch input/output tokens'
            color={colors.icGray2}
            icon={<UpDownIcon />}
            onClick={onSwitchTokens}
          />
        </Box>
        <TradeInputSelector
          config={{
            isInputDisabled: true,
            isSelectorDisabled: false,
            isReadOnly: true,
          }}
          caption={'You receive'}
          selectedToken={buyToken}
          selectedTokenAmount={outputTokenAmountFormatted}
          balance={outputTokenBalanceFormatted}
          formattedFiat={'0.0'} // Adjust as needed, possibly calculate based on output amount
          onSelectToken={() => {}}
        />
      </Flex>
      <>
        <TradeButton
          label={buttonLabel}
          isDisabled={isDisabled}
          isLoading={isApproving}
          onClick={onClickTradeButton}
        />
      </>
    </Box>
  )
}
