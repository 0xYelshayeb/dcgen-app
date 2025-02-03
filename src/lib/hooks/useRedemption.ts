import { useCallback, useState } from 'react'

import { prepareWriteContract, writeContract } from '@wagmi/core'

import { useWallet } from '@/lib/hooks/useWallet'
import { BigNumber, ethers } from 'ethers';
import navIssuanceModule from "../utils/abi/CustomOracleNavIssuanceModule.json"
import { arbNavIssuanceModuleAddres, baseNavIssuanceModuleAddres } from '@/constants/contracts';
import { WETH } from '@/constants/tokens';
import { Token } from '@/constants/tokens';
import { PublicClient } from 'wagmi';

const contractABI = navIssuanceModule.abi

export const useRedemption = (publicClient: PublicClient, token: Token) => {
  const { address } = useWallet()
  let wethAddress : String | undefined;
  let navIssuanceModuleAddress:`0x${string}`;
  switch (publicClient.chain.id) {
    case 8453:
      wethAddress = WETH.baseAddress
      navIssuanceModuleAddress = baseNavIssuanceModuleAddres
      break;
    case 42161:
      wethAddress = WETH.arbitrumAddress
      navIssuanceModuleAddress = arbNavIssuanceModuleAddres
      break;
    default:
      wethAddress = WETH.address
  }

  const [isTransacting, setIsTransacting] = useState(false)

  const executeRedeem = useCallback(
    async (amount: BigNumber) => {
      if (!address) return;

      try {
        setIsTransacting(true);

        // Prepare the contract write operation
        const prepared = await prepareWriteContract({
          abi: contractABI,
          address: navIssuanceModuleAddress,
          functionName: 'redeem',
          args: [token.address, wethAddress, amount, 0, address],
          chainId: publicClient.chain.id
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
    [address, publicClient]
  );

  return { executeRedeem, isTransacting };
};
