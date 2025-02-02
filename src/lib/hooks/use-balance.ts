import { useEffect, useMemo, useState } from 'react'
import { Address, PublicClient, usePublicClient } from 'wagmi'

import { ETH } from '@/constants/tokens'
import { ERC20_ABI } from '@/lib/utils/abi/interfaces'

class BalanceProvider {
  constructor(readonly publicClient: PublicClient) { }

  async getErc20Balance(publicClient: PublicClient, address: string, token: string): Promise<bigint> {
    return await publicClient.readContract({
      address: token as Address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address as Address],
    })
  }

  async getNativeBalance(address: string) {
    return await this.publicClient.getBalance({
      address: address as Address,
    })
  }
}

export function useBalance(publicClient: PublicClient, address?: string, token?: string) {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  useEffect(() => {
    async function fetchBalance() {
      if (!address || !token) return;
      const balanceProvider = new BalanceProvider(publicClient);
      const isETH = token.toLowerCase() === ETH.address!.toLowerCase();
      const balance = isETH
        ? await balanceProvider.getNativeBalance(address)
        : await balanceProvider.getErc20Balance(publicClient, address, token);
      setBalance(balance);
      console.log("balance found", balance);
    }
    fetchBalance();
  }, [address, token, publicClient]);

  return balance;
}

interface TokenBalance {
  token: string
  value: bigint
}

export function useBalances(address?: string, tokens?: string[]) {
  const publicClient = usePublicClient()
  const [balances, setBalances] = useState<TokenBalance[]>([])

  useEffect(() => {
    async function fetchBalance() {
      if (!address || !tokens || tokens.length === 0) return
      const balanceProvider = new BalanceProvider(publicClient)
      const promises = tokens.map((token) => {
        const isETH = token.toLowerCase() === ETH.address!.toLowerCase()
        const balance = isETH
          ? balanceProvider.getNativeBalance(address)
          : balanceProvider.getErc20Balance(publicClient, address, token)
        return balance
      })
      const results = await Promise.all(promises)
      const balances = tokens.map((token, index) => {
        return { token: token, value: results[index] }
      })
      setBalances(balances)
    }
    fetchBalance()
  }, [address, tokens, publicClient])

  return useMemo(() => {
    if (address && tokens) return balances
    return []
  }, [address, balances, tokens])
}
