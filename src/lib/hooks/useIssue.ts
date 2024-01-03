import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract} from '@wagmi/core'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import basicIssuanceModule from "../utils/abi/BasicIssuanceModule.json"
import { SETTOKEN } from '@/constants/tokens';
import { IssuanceModuleAddres } from '@/constants/contracts';

const contractAddress = IssuanceModuleAddres
const contractABI = basicIssuanceModule.abi
const setTokenAddress = SETTOKEN.address

export const useIssue = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeIssue = useCallback(
    async (amount: BigNumber) => {
      if (!address) return;

      try {
        setIsTransacting(true);

        // Prepare the contract write operation
        const prepared = await prepareWriteContract({
          abi: contractABI,
          address: contractAddress,
          functionName: 'issue',
          args: [setTokenAddress, amount, address],
          chainId: chainId,
        });

        // Execute the contract write
        const { hash } = await writeContract(prepared);
        console.log('Transaction hash:', hash);
      } catch (error) {
        console.error('Error issuing tokens:', error);
      } finally {
        setIsTransacting(false);
      }
    },
    [address, chainId]
  );

  return { executeIssue, isTransacting };
};
