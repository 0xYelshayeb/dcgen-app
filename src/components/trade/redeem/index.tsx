import { useCallback, useState } from 'react'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/lib/hooks/useWallet'
import { useRedeem } from '@/lib/hooks/useRedeem'
import { isValidTokenInput } from '@/lib/utils'
import { BigNumber, ethers } from 'ethers'
import { useColorStyles } from '@/lib/styles/colors'


export const Redeem = () => {
  const { styles } = useColorStyles()
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useWallet()
  const { executeRedeem, isTransacting } = useRedeem()
  const [amount, setAmount] = useState('')
  const [formattedAmount, setFormattedAmount] = useState('0.0')

  const onRedeem = useCallback(async () => {
    if (!amount || !isValidTokenInput(amount, 18)) return
    try {
      // Assuming the amount is entered in Ether and needs to be converted to Wei
      const amountInWei = ethers.utils.parseEther(amount)
      await executeRedeem(BigNumber.from(amountInWei))
    } catch (error) {
      console.error('Issue operation failed:', error)
    }
  }, [formattedAmount, executeRedeem])

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setAmount(value)
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      setFormattedAmount(value)
    }
  }

  const handleConnectWallet = () => {
    if (openConnectModal) {
      openConnectModal()
    }
  }

  return (
    <Box>
      {!isConnected && (
        <Button onClick={handleConnectWallet}>Connect Wallet</Button>
      )}
      {isConnected && (
        <>
          <Input
            placeholder='0.0'
            value={amount}
            onChange={handleInputChange}
            marginBottom={2}
            marginTop={2}
          />
          <Button
            background={styles.backgroundInverted}
            border='0'
            borderRadius='12px'
            color={styles.textInverted}
            disabled={!amount || isTransacting}
            fontSize='24px'
            fontWeight='600'
            isLoading={isTransacting}
            height='54px'
            w='100%'
            onClick={onRedeem}
          >
            {formattedAmount !== '0.0' ? 'Redeem' : 'Enter an amount'}
          </Button>
        </>
      )}
      {!address && <Text>Please connect your wallet to issue tokens.</Text>}
    </Box>
  )
}
