import { useCallback, useState } from 'react'
import { useNetwork } from '@/lib/hooks/useNetwork'
import { readContract } from '@wagmi/core';
import setTokenABI from "../utils/abi/SetToken.json" // Make sure this is the correct ABI
import { setTokenAddress } from '@/constants/contracts';

export const useGetComponents = () => {
  const { chainId } = useNetwork()

  const fetchComponents = useCallback(async () => {
    try {
      const result = await readContract({
        address: setTokenAddress,
        abi: setTokenABI.abi,
        functionName: 'getComponents',
        chainId: chainId,
      });
      const components = result as string[];
      return components;
    } catch (error) {
      console.error('Error fetching components:', error);
      return [];
    }
  }, [chainId]);

  return { fetchComponents };
};
