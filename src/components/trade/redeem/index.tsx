import { useCallback, useState } from 'react'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/lib/hooks/useWallet'
import { useRedeem } from '@/lib/hooks/useRedeem'
import { isValidTokenInput } from '@/lib/utils'
import { BigNumber, ethers } from 'ethers'

export const Redeem = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useWallet()
  const { executeRedeem, isTransacting } = useRedeem()
  const [amount, setAmount] = useState('')

  const onRedeem = useCallback(async () => {
    if (!amount || !isValidTokenInput(amount, 18)) return
    try {
      // Assuming the amount is entered in Ether and needs to be converted to Wei
      const amountInWei = ethers.utils.parseEther(amount)
      await executeRedeem(BigNumber.from(amountInWei))
    } catch (error) {
      console.error('Issue operation failed:', error)
    }
  }, [amount, executeRedeem])

  const handleInputChange = (e:any) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      setAmount(value);
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
            placeholder='Enter amount'
            value={amount}
            onChange={handleInputChange}
            mb={3}
          />
          <Button
            onClick={onRedeem}
            isLoading={isTransacting}
            disabled={!amount || isTransacting}
            mb={3}
          >
            Redeem
          </Button>
        </>
      )}
      {!address && <Text>Please connect your wallet to issue tokens.</Text>}
    </Box>
  )
}
