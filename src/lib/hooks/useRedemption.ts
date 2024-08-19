import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract } from '@wagmi/core'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import basicIssuanceModule from "../utils/abi/BasicIssuanceModule.json"
import navIssuanceModule from "../utils/abi/CustomOracleNavIssuanceModule.json"
import { DCA } from '@/constants/tokens';
import { navIssuanceModuleAddres } from '@/constants/contracts';
import { WETH } from '@/constants/tokens';

const contractABI = navIssuanceModule.abi
const setTokenAddress = DCA.address

export const useRedemption = () => {
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
          address: navIssuanceModuleAddres,
          functionName: 'redeem',
          args: [setTokenAddress, WETH.address, amount, 0, address],
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
