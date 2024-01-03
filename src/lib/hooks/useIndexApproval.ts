import { useCallback, useEffect, useState } from 'react';
import { BigNumber, constants } from 'ethers';
import { useWallet } from '@/lib/hooks/useWallet';
import { getERC20Contract } from '@/lib/utils/contracts';

interface Approvals {
  [address: string]: boolean;
}

export const useIndexApproval = (tokenAddresses : string[], spenderAddress : string, amount = constants.MaxUint256) => {
  const { provider, signer } = useWallet();
  const [approvals, setApprovals] = useState<Approvals>({});
  const [isApproving, setIsApproving] = useState(false);

  const fetchApprovals = useCallback(async () => {
    const approvalsStatus : Approvals = {};
    for (const address of tokenAddresses) {
      const contract = getERC20Contract(address, provider);
      const allowance = await contract.allowance(signer.getAddress(), spenderAddress);
      approvalsStatus[address] = allowance.gte(amount);
    }
    setApprovals(approvalsStatus);
  }, [provider, signer, tokenAddresses, spenderAddress, amount]);

  const approveAll = useCallback(async () => {
    setIsApproving(true);
    try {
      for (const address of tokenAddresses) {
        if (!approvals[address]) {
          const contract = getERC20Contract(address, signer);
          const tx = await contract.approve(spenderAddress, amount);
          await tx.wait();
        }
      }
      await fetchApprovals();
    } catch (error) {
      console.error('Error approving tokens:', error);
    } finally {
      setIsApproving(false);
    }
  }, [approvals, signer, tokenAddresses, spenderAddress, amount, fetchApprovals]);

  useEffect(() => {
    if (signer && spenderAddress && tokenAddresses.length > 0) {
      fetchApprovals();
    }
  }, [signer, spenderAddress, tokenAddresses, fetchApprovals]);

  return { approvals, approveAll, isApproving };
};
