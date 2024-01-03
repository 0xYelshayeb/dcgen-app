import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract } from '@wagmi/core'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import basicIssuanceModule from "../utils/abi/BasicIssuanceModule.json"
import { SETTOKEN } from '@/constants/tokens';
import { IssuanceModuleAddres } from '@/constants/contracts';

const contractABI = basicIssuanceModule.abi
const setTokenAddress = SETTOKEN.address

export const useRedeem = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeRedeem = useCallback(
    async (amount: BigNumber) => {
      if (!address) return;

      try {
        setIsTransacting(true);

        // Prepare the contract write operation
        const prepared = await prepareWriteContract({
          abi: contractABI,
          address: IssuanceModuleAddres,
          functionName: 'redeem',
          args: [setTokenAddress, amount, address],
          chainId: chainId,
        });

        // Execute the contract write
        const { hash } = await writeContract(prepared);
        console.log('Transaction hash:', hash);
      } catch (error) {
        console.error('Error redeeming tokens:', error);
      } finally {
        setIsTransacting(false);
      }
    },
    [address, chainId]
  );

  return { executeRedeem, isTransacting };
};
