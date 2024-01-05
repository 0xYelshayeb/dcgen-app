import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract} from '@wagmi/core'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import basicIssuanceModule from "../utils/abi/BasicIssuanceModule.json"
import { SETTOKEN } from '@/constants/tokens';
import { IssuanceModuleAddres } from '@/constants/contracts';

export const useIssuance = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const [isTransacting, setIsTransacting] = useState(false)

  const executeIssue = useCallback(
    async (amount: BigNumber) => {
      if (!address) return;

      try {
        setIsTransacting(true);
        console.log("formatting amount")

        // Prepare the contract write operation
        const prepared = await prepareWriteContract({
          abi: basicIssuanceModule.abi,
          address: IssuanceModuleAddres,
          functionName: 'issue',
          args: [SETTOKEN.address, amount, address],
          chainId: chainId,
        });

        console.log("writing contract");

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
