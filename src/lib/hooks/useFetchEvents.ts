import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MultiSigAbi from '../utils/abi/MultiSigOperator.json';
import { useWallet } from './useWallet';
import { multiSigOperatorAddress } from '@/constants/contracts';

const contractABI = MultiSigAbi.abi;

export const useFetchEvents = () => {
    const [rebalanceEvents, setRebalanceEvents] = useState<ethers.Event[]>([]);
    const [operatorEvents, setOperatorEvents] = useState<ethers.Event[]>([]);
    const { provider } = useWallet();

    useEffect(() => {
        if (!provider) {
            return; // Do not proceed if provider is not available
        }

        const contract = new ethers.Contract(multiSigOperatorAddress, contractABI, provider);

        const fetchEvents = async () => {
            const latestBlock = await provider.getBlockNumber();
            const fromBlock = Math.max(0, latestBlock - 100000); // Fetch last 10.000 blocks, adjust as needed

            const rebalanceFilter = contract.filters.SubmitRebalance();
            const rebalanceLogs = await contract.queryFilter(rebalanceFilter, fromBlock, latestBlock);
            setRebalanceEvents(rebalanceLogs);

            const operatorFilter = contract.filters.SubmitNewOperator();
            const operatorLogs = await contract.queryFilter(operatorFilter, fromBlock, latestBlock);
            setOperatorEvents(operatorLogs);
        };

        fetchEvents();
    }, [provider]);

    return { rebalanceEvents, operatorEvents };
};