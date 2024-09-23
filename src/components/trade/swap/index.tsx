import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'

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

import { RethSupplyCapOverrides } from '@/components/supply'
import { TradeInputSelector } from './components/trade-input-selector'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'

import axios from 'axios' // Import axios for API calls

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
  const [outputTokenAmountUsd, setOutputTokenAmountUsd] = useState('0') // New state variable

  // Fetch data for WETH
  const {
    hasInsufficientFunds: hasInsufficientFundsWeth,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedWeth,
  } = useNavIssue(WETH, inputTokenAmountFormatted)

  // Fetch data for DCA
  const {
    hasInsufficientFunds: hasInsufficientFundsDca,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedDca,
  } = useRedeem(DCA, inputTokenAmountFormatted)

  // Approval hooks
  const {
    isApproved: isApprovedWeth,
    isApproving: isApprovingWeth,
    approve: onApproveWeth,
  } = useApproval(WETH, navIssuanceModuleAddres)

  const {
    isApproved: isApprovedDca,
    isApproving: isApprovingDca,
    approve: onApproveDca,
  } = useApproval(DCA, navIssuanceModuleAddres)

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
    setInputTokenAmount('')
    setInputTokenAmountFormatted('0')
    setInputTokenAmountUsd('0')
    setOutputTokenAmountUsd('0')
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
    } else if (sellToken.symbol === DCA.symbol) {
      // We are selling DCA to buy WETH
      setIsApproved(isApprovedDca)
      setIsApproving(isApprovingDca)
      setHasInsufficientFunds(hasInsufficientFundsDca)
      setInputTokenBalanceFormatted(inputTokenBalanceFormattedDca)
      setOutputTokenBalanceFormatted(inputTokenBalanceFormattedWeth)
    }
    // Update sellTokenAmount
    setSellTokenAmount(inputTokenAmountFormatted)
  }, [
    sellToken,
    buyToken,
    inputTokenAmountFormatted,
    isApprovedWeth,
    isApprovingWeth,
    hasInsufficientFundsWeth,
    inputTokenBalanceFormattedWeth,
    isApprovedDca,
    isApprovingDca,
    hasInsufficientFundsDca,
    inputTokenBalanceFormattedDca,
  ])

  useEffect(() => {
    setIsTransacting(isRedeeming || isIssuing)
  }, [isRedeeming, isIssuing])

  // Fetch the indexPrice from the backend
  const [indexPrice, setIndexPrice] = useState<number | null>(null)
  // Fetch WETH USD price
  const [wethUsdPrice, setWethUsdPrice] = useState<number | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Fetch index price
        const indexResponse = await axios.get('https://api.dcgen.finance/valuation')
        const price = indexResponse.data.indexPrice
        setIndexPrice(parseFloat(price))

        // Fetch WETH USD price from CoinGecko
        const wethResponse = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'weth',
              vs_currencies: 'usd',
            },
          }
        )
        const wethPrice = wethResponse.data.weth.usd
        setWethUsdPrice(wethPrice)
      } catch (error) {
        console.error('Error fetching prices:', error)
        setIndexPrice(null)
        setWethUsdPrice(null)
      }
    }

    fetchPrices()
    // Optionally, set up an interval to refresh the price periodically
    // const intervalId = setInterval(fetchPrices, 60000) // Refresh every 60 seconds
    // return () => clearInterval(intervalId)
  }, [])

  // Calculate the output amount and USD values based on the fetched indexPrice and WETH USD price
  useEffect(() => {
    const calculateOutputAndUsdAmount = () => {
      if (
        !inputTokenAmountFormatted ||
        inputTokenAmountFormatted === '0' ||
        indexPrice === null ||
        wethUsdPrice === null
      ) {
        setOutputTokenAmountFormatted('0')
        setInputTokenAmountUsd('0')
        setOutputTokenAmountUsd('0')
        return
      }

      const amountInput = ethers.utils.parseUnits(
        inputTokenAmountFormatted,
        sellToken.decimals
      )

      if (sellToken.symbol === WETH.symbol && indexPrice > 0) {
        // We are issuing DCA tokens with WETH
        const priceInWei = ethers.utils.parseUnits(indexPrice.toString(), WETH.decimals)
        const outputAmount = amountInput.mul(ethers.constants.WeiPerEther).div(priceInWei)
        const outputAmountFormatted = ethers.utils.formatUnits(
          outputAmount,
          buyToken.decimals
        )
        setOutputTokenAmountFormatted(outputAmountFormatted)

        // Calculate USD amounts
        const inputUsd = parseFloat(inputTokenAmountFormatted) * wethUsdPrice
        setInputTokenAmountUsd(inputUsd.toFixed(2))
        setOutputTokenAmountUsd(inputUsd.toFixed(2)) // Same as input USD
      } else if (sellToken.symbol === DCA.symbol && indexPrice > 0) {
        // We are redeeming DCA tokens for WETH
        const priceInWei = ethers.utils.parseUnits(indexPrice.toString(), WETH.decimals)
        const outputAmount = amountInput.mul(priceInWei).div(ethers.constants.WeiPerEther)
        const outputAmountFormatted = ethers.utils.formatUnits(
          outputAmount,
          buyToken.decimals
        )
        setOutputTokenAmountFormatted(outputAmountFormatted)

        // Calculate USD amounts
        const equivalentWethAmount = parseFloat(outputAmountFormatted)
        const usdValue = equivalentWethAmount * wethUsdPrice
        setInputTokenAmountUsd(usdValue.toFixed(2))
        setOutputTokenAmountUsd(usdValue.toFixed(2)) // Same as input USD
      } else {
        setOutputTokenAmountFormatted('0')
        setInputTokenAmountUsd('0')
        setOutputTokenAmountUsd('0')
      }
    }

    calculateOutputAndUsdAmount()
  }, [
    inputTokenAmountFormatted,
    sellToken,
    buyToken,
    indexPrice,
    wethUsdPrice,
  ])

  const onChangeInputTokenAmount = (token: Token, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers and decimal points
      setInputTokenAmount(value)
      setInputTokenAmountFormatted(value === '' ? '0' : value)
    }
    setSellTokenAmount(value || '')
  }

  const setMaxBalance = () => {
    setInputTokenAmount(inputTokenBalanceFormatted)
    setInputTokenAmountFormatted(inputTokenBalanceFormatted)
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
        await executeNavIssue(ethers.utils.parseUnits(inputTokenAmountFormatted, WETH.decimals))
      } else if (sellToken.symbol === DCA.symbol) {
        await executeRedeem(ethers.utils.parseUnits(inputTokenAmountFormatted, DCA.decimals))
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
    inputTokenAmountFormatted,
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
          formattedFiat={`$${inputTokenAmountUsd}`}
          selectedToken={sellToken}
          selectedTokenAmount={inputTokenAmount}
          onChangeInput={onChangeInputTokenAmount}
          onClickBalance={() => setMaxBalance()}
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
          formattedFiat={`$${outputTokenAmountUsd}`} // Display output USD amount
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
