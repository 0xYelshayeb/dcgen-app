import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract} from '@wagmi/core'

import { useNetwork } from '@/lib/hooks/useNetwork'
import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import navIssuanceModule from "../utils/abi/CustomOracleNavIssuanceModule.json"
import { DCA, MEME } from '@/constants/tokens';
import { WETH } from '@/constants/tokens';
import { navIssuanceModuleAddres } from '@/constants/contracts';

const contractABI = navIssuanceModule.abi
const setTokenAddress = DCA.address
const weth = WETH.address

export const useNavIssuance = () => {
  const { address } = useWallet()
  const { chainId } = useNetwork()

  const [isNavTransacting, setIsTransacting] = useState(false)

  const executeNavIssue = useCallback(
    async (amount: BigNumber) => {
      if (!address) return;
      console.log("amount", amount);

      try {
        setIsTransacting(true);
        console.log("preparing");

        // Prepare the contract write operation
        const prepared = await prepareWriteContract({
          abi: contractABI,
          address: navIssuanceModuleAddres,
          functionName: 'issue',
          args: [setTokenAddress, weth, amount, 0, address],
          chainId: chainId,
        });

        console.log("prepared", prepared);

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

  return { executeNavIssue, isNavTransacting };
};
