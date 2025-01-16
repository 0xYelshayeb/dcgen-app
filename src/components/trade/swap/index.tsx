import { useCallback, useEffect, useMemo, useState } from 'react'
import { ethers } from 'ethers'

import { colors, useICColorMode } from '@/lib/styles/colors'

import { UpDownIcon } from '@chakra-ui/icons'
import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { TradeButton } from '@/components/trade-button'
import { Token, DCA, WETH, MEME } from '@/constants/tokens'
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
import { configureChains, PublicClient } from 'wagmi'
import { FallbackTransport } from 'viem'
import { arbitrum, base, mainnet, Chain } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import { RethSupplyCapOverrides } from '@/components/supply'
import { TradeInputSelector } from './components/trade-input-selector'
import {
  TradeButtonState,
  useTradeButtonState,
} from './hooks/use-trade-button-state'

import axios from 'axios' // Import axios for API calls

const { publicClient: defaultPublicClient } = configureChains([arbitrum], [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
  publicProvider(),
]);

// TODO: remove with new navigation
export type QuickTradeProps = {
  onOverrideSupplyCap?: (overrides: RethSupplyCapOverrides | undefined) => void
  onShowSupplyCap?: (show: boolean) => void
  switchTabs?: () => void
  product: string
}

export const Swap = (props: QuickTradeProps) => {
  const { openConnectModal } = useConnectModal()
  const { isDarkMode } = useICColorMode()
  const { address } = useWallet()

  const chainMap: Record<number, Chain> = {
    [mainnet.id]: mainnet,
    [arbitrum.id]: arbitrum,
    [base.id]: base,
  };

  const [sellToken, setSellToken] = useState<Token>(WETH)
  const [setToken, setSetToken] = useState<Token>(DCA)
  const [buyToken, setBuyToken] = useState<Token>(DCA)
  const [publicClient, setPublicClient] = useState(defaultPublicClient({chainId: setToken.defaultChain??1}));

  useEffect(() => {
    const chain = chainMap[setToken.defaultChain??1] || mainnet;

    // Configure the chain and set the public client
    const { publicClient: getPublicClient } = configureChains([chain], [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
      publicProvider(),
    ]);

    console.log("chaning chain to ", setToken.defaultChain??1);
    console.log(publicClient.chain)

    // Call the function to get the actual PublicClient instance
    setPublicClient(getPublicClient({ chainId: setToken.defaultChain??1 }));
  }, [setToken]);

  const { executeRedeem, isTransacting: isRedeeming } = useRedemption()
  const { executeNavIssue, isNavTransacting: isIssuing } = useNavIssuance()

  const [isTransacting, setIsTransacting] = useState(false)
  const [inputTokenAmount, setInputTokenAmount] = useState('')
  const [inputTokenAmountFormatted, setInputTokenAmountFormatted] = useState('0')
  const [outputTokenAmount, setOutputTokenAmount] = useState('')
  const [outputTokenAmountFormatted, setOutputTokenAmountFormatted] = useState('0')
  const [sellTokenAmount, setSellTokenAmount] = useState('0')

  // State variables for balances and other data
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [hasInsufficientFunds, setHasInsufficientFunds] = useState(false)
  const [inputTokenBalanceFormatted, setInputTokenBalanceFormatted] = useState('0')
  const [outputTokenBalanceFormatted, setOutputTokenBalanceFormatted] = useState('0')
  const [inputTokenAmountUsd, setInputTokenAmountUsd] = useState('0')
  const [outputTokenAmountUsd, setOutputTokenAmountUsd] = useState('0') // New state variable

  const [isInputAmountChanging, setIsInputAmountChanging] = useState(false)
  const [isOutputAmountChanging, setIsOutputAmountChanging] = useState(false)

  // Fetch data for WETH
  const {
    hasInsufficientFunds: hasInsufficientFundsWeth,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedWeth,
    inputTokenAmountWei: inputTokenAmountWeiWeth,
  } = useNavIssue(publicClient, WETH, inputTokenAmountFormatted)

  // Fetch data for SET
  const {
    hasInsufficientFunds: hasInsufficientFundsSet,
    inputTokenBalanceFormatted: inputTokenBalanceFormattedSet,
    inputTokenAmountWei: inputTokenAmountWeiSet,
  } = useRedeem(publicClient, setToken, inputTokenAmountFormatted)

  // Approval hooks
  const {
    isApproved: isApprovedWeth,
    isApproving: isApprovingWeth,
    approve: onApproveWeth,
  } = useApproval(WETH, navIssuanceModuleAddres, inputTokenAmountWeiWeth)

  const {
    isApproved: isApprovedSet,
    isApproving: isApprovingSet,
    approve: onApproveSet,
  } = useApproval(setToken, navIssuanceModuleAddres, inputTokenAmountWeiSet)

  const shouldApprove = useMemo(() => {
    const nativeToken = getNativeToken(setToken.defaultChain??1)
    const isNativeToken = nativeToken?.symbol === sellToken.symbol
    return !isNativeToken
  }, [setToken.defaultChain??1, sellToken])

  const buttonState = useTradeButtonState(
    false,
    hasInsufficientFunds,
    shouldApprove,
    isApproved,
    isApproving,
    isTransacting,
    sellTokenAmount
  )

  const { buttonLabel, isDisabled } = useTradeButton(buttonState, sellToken, buyToken)

  const resetTradeData = () => {
    setInputTokenAmount('')
    setInputTokenAmountFormatted('0')
    setInputTokenAmountUsd('0')
    setOutputTokenAmountUsd('0')
    setSellTokenAmount('0')
    setOutputTokenAmountFormatted('0')
    setOutputTokenAmount('')
    setIsInputAmountChanging(false)
    setIsOutputAmountChanging(false)
  }

  useEffect(() => {
    // Update state variables based on the current sellToken and buyToken
    if (sellToken.symbol === WETH.symbol) {
      // We are selling WETH to buy DCA
      setIsApproved(isApprovedWeth)
      setIsApproving(isApprovingWeth)
      setHasInsufficientFunds(hasInsufficientFundsWeth)
      setInputTokenBalanceFormatted(inputTokenBalanceFormattedWeth)
      setOutputTokenBalanceFormatted(inputTokenBalanceFormattedSet)
    } else if (sellToken.symbol === DCA.symbol) {
      // We are selling DCA to buy WETH
      setIsApproved(isApprovedSet)
      setIsApproving(isApprovingSet)
      setHasInsufficientFunds(hasInsufficientFundsSet)
      setInputTokenBalanceFormatted(inputTokenBalanceFormattedSet)
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
    isApprovedSet,
    isApprovingSet,
    hasInsufficientFundsSet,
    inputTokenBalanceFormattedSet,
    setToken,
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

  useEffect(() => {
    // change the settoken to dca/meme based on the selected product
    if (props.product === 'DCgen Governance Core') {
      setBuyToken(DCA)
      setSetToken(DCA)
    } else if (props.product === 'DCgen Meme') {
      setSetToken(MEME)
      setBuyToken(MEME)
    }
    setSellToken(WETH)
    resetTradeData()
  }
    , [props.product])

  const calculateAmountsFromInput = () => {
    if (
      !inputTokenAmountFormatted ||
      inputTokenAmountFormatted === '0' ||
      indexPrice === null ||
      wethUsdPrice === null
    ) {
      setOutputTokenAmountFormatted('0')
      setOutputTokenAmount('')
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
      const outputAmountFormatted = parseFloat(
        ethers.utils.formatUnits(outputAmount, buyToken.decimals)
      ).toFixed(3)
      setOutputTokenAmountFormatted(outputAmountFormatted)
      setOutputTokenAmount(outputAmountFormatted)

      // Calculate USD amounts
      const inputUsd = parseFloat(inputTokenAmountFormatted) * wethUsdPrice
      setInputTokenAmountUsd(inputUsd.toFixed(2))
      setOutputTokenAmountUsd(inputUsd.toFixed(2)) // Same as input USD
    } else if (sellToken.symbol === DCA.symbol && indexPrice > 0) {
      // We are redeeming DCA tokens for WETH
      const priceInWei = ethers.utils.parseUnits(indexPrice.toString(), WETH.decimals)
      const outputAmount = amountInput.mul(priceInWei).div(ethers.constants.WeiPerEther)
      const outputAmountFormatted = parseFloat(
        ethers.utils.formatUnits(outputAmount, buyToken.decimals)
      ).toFixed(5)
      setOutputTokenAmountFormatted(outputAmountFormatted)
      setOutputTokenAmount(outputAmountFormatted)

      // Calculate USD amounts
      const equivalentWethAmount = parseFloat(outputAmountFormatted)
      const usdValue = equivalentWethAmount * wethUsdPrice
      setInputTokenAmountUsd(usdValue.toFixed(2))
      setOutputTokenAmountUsd(usdValue.toFixed(2)) // Same as input USD
    } else {
      setOutputTokenAmountFormatted('0')
      setOutputTokenAmount('')
      setInputTokenAmountUsd('0')
      setOutputTokenAmountUsd('0')
    }
  }

  const calculateAmountsFromOutput = () => {
    if (
      !outputTokenAmountFormatted ||
      outputTokenAmountFormatted === '0' ||
      indexPrice === null ||
      wethUsdPrice === null
    ) {
      setInputTokenAmountFormatted('0')
      setInputTokenAmount('')
      setInputTokenAmountUsd('0')
      setOutputTokenAmountUsd('0')
      return
    }

    const amountOutput = ethers.utils.parseUnits(
      outputTokenAmountFormatted,
      buyToken.decimals
    )

    if (buyToken.symbol === DCA.symbol && indexPrice > 0) {
      // We are issuing DCA tokens with WETH
      // Input WETH amount = Output DCA amount * indexPrice
      const priceInWei = ethers.utils.parseUnits(indexPrice.toString(), WETH.decimals)
      const inputAmount = amountOutput.mul(priceInWei).div(ethers.constants.WeiPerEther)
      const inputAmountFormatted = parseFloat(
        ethers.utils.formatUnits(inputAmount, sellToken.decimals)
      ).toFixed(5)
      setInputTokenAmountFormatted(inputAmountFormatted)
      setInputTokenAmount(inputAmountFormatted)

      // Calculate USD amounts
      const inputUsd = parseFloat(inputAmountFormatted) * wethUsdPrice
      setInputTokenAmountUsd(inputUsd.toFixed(2))
      setOutputTokenAmountUsd(inputUsd.toFixed(2)) // Same as input USD
    } else if (buyToken.symbol === WETH.symbol && indexPrice > 0) {
      // We are redeeming DCA tokens for WETH
      // Input DCA amount = Output WETH amount / indexPrice
      const priceInWei = ethers.utils.parseUnits(indexPrice.toString(), WETH.decimals)
      const inputAmount = amountOutput
        .mul(ethers.constants.WeiPerEther)
        .div(priceInWei)
      const inputAmountFormatted = parseFloat(
        ethers.utils.formatUnits(inputAmount, sellToken.decimals)
      ).toFixed(3)
      setInputTokenAmountFormatted(inputAmountFormatted)
      setInputTokenAmount(inputAmountFormatted)

      // Calculate USD amounts
      const equivalentWethAmount = parseFloat(outputTokenAmountFormatted)
      const usdValue = equivalentWethAmount * wethUsdPrice
      setInputTokenAmountUsd(usdValue.toFixed(2))
      setOutputTokenAmountUsd(usdValue.toFixed(2)) // Same as input USD
    } else {
      setInputTokenAmountFormatted('0')
      setInputTokenAmount('')
      setInputTokenAmountUsd('0')
      setOutputTokenAmountUsd('0')
    }
  }

  useEffect(() => {
    if (isInputAmountChanging) {
      calculateAmountsFromInput()
      setIsInputAmountChanging(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputTokenAmountFormatted, isInputAmountChanging, sellToken, buyToken, indexPrice, wethUsdPrice])

  useEffect(() => {
    if (isOutputAmountChanging) {
      calculateAmountsFromOutput()
      setIsOutputAmountChanging(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputTokenAmountFormatted, isOutputAmountChanging, sellToken, buyToken, indexPrice, wethUsdPrice])

  const onChangeInputTokenAmount = (token: Token, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers and decimal points
      setInputTokenAmount(value)
      setInputTokenAmountFormatted(value === '' ? '0' : value)
      setIsInputAmountChanging(true)
      setIsOutputAmountChanging(false)
    }
    setSellTokenAmount(value || '')
  }

  const onChangeOutputTokenAmount = (token: Token, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      // Allow only numbers and decimal points
      setOutputTokenAmount(value)
      setOutputTokenAmountFormatted(value === '' ? '0' : value)
      setIsOutputAmountChanging(true)
      setIsInputAmountChanging(false)
    }
  }

  const setMaxBalance = () => {
    setInputTokenAmount(inputTokenBalanceFormatted)
    setInputTokenAmountFormatted(inputTokenBalanceFormatted)
    setIsInputAmountChanging(true)
    setIsOutputAmountChanging(false)
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
      } else if (sellToken.symbol === setToken.symbol) {
        await onApproveSet()
      }
      return
    }

    if (buttonState === TradeButtonState.default) {
      if (sellToken.symbol === WETH.symbol) {
        await executeNavIssue(
          ethers.utils.parseUnits(inputTokenAmountFormatted, WETH.decimals)
        )
      } else if (sellToken.symbol === setToken.symbol) {
        await executeRedeem(
          ethers.utils.parseUnits(inputTokenAmountFormatted, setToken.decimals)
        )
      }
      resetTradeData()
    }
  }, [
    buttonState,
    isApproved,
    onApproveWeth,
    onApproveSet,
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
          onSelectToken={() => { }}
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
            isReadOnly: false, // Make it editable
            isInputDisabled: false,
            isSelectorDisabled: false,
          }}
          caption={'You receive'}
          selectedToken={buyToken}
          selectedTokenAmount={outputTokenAmount}
          balance={outputTokenBalanceFormatted}
          formattedFiat={`$${outputTokenAmountUsd}`} // Display output USD amount
          onSelectToken={() => { }}
          onChangeInput={onChangeOutputTokenAmount}
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
