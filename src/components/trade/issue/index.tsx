import { useCallback, useState, useEffect } from 'react'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/lib/hooks/useWallet'
import { useIssue } from '@/lib/hooks/useIssue'
import { useNavIssue } from '@/lib/hooks/useNavIssue'
import { useApproval } from '@/lib/hooks/useApproval'
import { isValidTokenInput } from '@/lib/utils'
import { BigNumber, ethers } from 'ethers'
import { WETH } from '@/constants/tokens'
import { useGetComponents } from '@/lib/hooks/useGetComponents'
import { getTokenforAddress } from '@/lib/utils/tokens'
import { useIndexApproval } from '@/lib/hooks/useIndexApproval'

export const Issue = () => {
  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useWallet()
  const { executeIssue, isTransacting } = useIssue()
  const { executeNavIssue, isNavTransacting } = useNavIssue()
  const [amount, setAmount] = useState('')
  const [formattedAmount, setFormattedAmount] = useState('0')
  const [navAmount, setNavAmount] = useState('') // State for NAV amount
  const [formattedNavAmount, setFormattedNavAmount] = useState('0') // State for formatted NAV amount
  const { fetchComponents } = useGetComponents()

  const [components, setComponents] = useState<string[]>([]);
  const [approvals, setApprovals] = useState<{ [address: string]: boolean }>({});

  useEffect(() => {
    fetchComponents().then(setComponents);
  }, []);

  const contractAddress = "0x6462802576CF2a7eEf655f62fBDa48693CB36201"

  // Use the useIndexApproval hook
  const { approvals: tokenApprovals, approveAll, isApproving} = useIndexApproval(components, contractAddress, ethers.utils.parseEther(formattedAmount));

  const { isApproved: isWethApproved, approve: approveWeth } = useApproval(WETH, contractAddress, ethers.utils.parseEther(formattedNavAmount));

  const onIssue = useCallback(async () => {
    if (!amount || !isValidTokenInput(amount, 18)) return
    if(!tokenApprovals){
      await approveAll();
      return;
    }
    try {
      // Assuming the amount is entered in Ether and needs to be converted to Wei
      const amountInWei = ethers.utils.parseEther(amount)
      console.log(amountInWei)
      await executeIssue(BigNumber.from(amountInWei))
    } catch (error) {
      console.error('Issue operation failed:', error)
    }
  }, [amount, executeIssue])

  const onNavIssue = useCallback(async () => {
    if (!navAmount || !isValidTokenInput(navAmount, 18)) return
    if (!isWethApproved) {
      await approveWeth();
      return;
    }
    try {
      const navAmountInWei = ethers.utils.parseEther(navAmount)
      console.log(navAmountInWei)
      await executeNavIssue(BigNumber.from(navAmountInWei))
    } catch (error) {
      console.error('NAV Issue operation failed:', error)
    }
  }, [navAmount, executeNavIssue])

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setAmount(value); // Set the actual input field value
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      // Set numericAmount to 0 if value is empty, else set to the value
      setFormattedAmount(value === '' ? '0' : value);
    }
  };

  const handleNavInputChange = (e: any) => {
    const value = e.target.value;
    setNavAmount(value); // Set the actual input field value
    if (/^\d*\.?\d*$/.test(value)) { // Allow only numbers and decimal points
      // Same logic as above for NAV amount
      setFormattedNavAmount(value === '' ? '0' : value);
    }
  };

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
            mb={3}
          />
          <Button
            onClick={onIssue}
            isLoading={isTransacting}
            disabled={!amount || isTransacting}
            mb={3}
          >
            Standard Issue
          </Button>
          <Input
            placeholder='0.0'
            value={navAmount}
            onChange={handleNavInputChange}
            mb={3}
          />
          <Button
            onClick={onNavIssue}
            isLoading={isNavTransacting}
            disabled={!navAmount || isNavTransacting || !isWethApproved}
            mb={3}
          >
            NAV Issue
          </Button>
        </>
      )}
      {!address && <Text>Please connect your wallet to issue tokens.</Text>}
    </Box>
  )
}
