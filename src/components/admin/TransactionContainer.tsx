import { useEffect, useState } from 'react';
import { Flex, Text, Button, Box, VStack, Divider, Checkbox } from '@chakra-ui/react';
import { useFetchEvents } from '@/lib/hooks/useFetchEvents';
import { ethers } from 'ethers';
import { useWallet } from '@/lib/hooks/useWallet';
import MultiSigAbi from '../../lib/utils/abi/MultiSigOperator.json';
import { use } from 'chai';

const TransactionContainer = () => {
    const { rebalanceEvents, operatorEvents } = useFetchEvents();
    const [approveRebalance, setApproveRebalance] = useState(false);
    const [approveOperator, setApproveOperator] = useState(false);
    const [rebalanceConfirmations, setRebalanceConfirmations] = useState(0);

    const [executeRebalance, setExecuteRebalance] = useState(false);
    const [executeOperator, setExecuteOperator] = useState(false);

    const { provider, signer } = useWallet();

    const contractABI = MultiSigAbi.abi;
    const contractAddress = "0x855081b7F177D47949C998DA7dD45471880C3894";
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const fetchRebalanceConfirmations = async () => {
        const latestEvent = rebalanceEvents[rebalanceEvents.length - 1];
        if (latestEvent) {
            const rebalance = await contract.getRebalance();
            console.log(rebalance);
            setRebalanceConfirmations(rebalance[5].toNumber());
        }
    };

    const confirmNewOperator = async () => {
        try {
            const tx = await contract.confirmNewOperator();
            await tx.wait();
            console.log('New operator confirmed');
        } catch (error) {
            console.error('Error confirming new operator:', error);
        }
    };

    const executeRebalanceTransaction = async () => {
        try {
            const tx = await contract.executeRebalance();
            await tx.wait();
            console.log('Rebalance executed');
        } catch (error) {
            console.error('Error executing rebalance:', error);
        }
    };

    // Function to execute the latest operator change
    const executeOperatorTransaction = async () => {
        try {
            const tx = await contract.executeNewOperator();
            await tx.wait();
            console.log('New operator executed');
        } catch (error) {
            console.error('Error executing new operator:', error);
        }
    };

    const confirmRebalance = async () => {
        try {
            const tx = await contract.confirmRebalance();
            await tx.wait();
            console.log('Rebalance confirmed');
        } catch (error) {
            console.error('Error confirming rebalance:', error);
        }
    };

    const handleApprove = () => {
        if (approveRebalance) {
            console.log('Approving Rebalance');
            confirmRebalance();
        }
        if (approveOperator) {
            console.log('Approving New Operator');
            confirmNewOperator();
        }
    };

    const handleExecute = () => {
        if (executeRebalance) {
            executeRebalanceTransaction();
        }
        if (executeOperator) {
            executeOperatorTransaction();
        }
    };


    // Get the latest events
    const latestRebalanceEvent = rebalanceEvents[rebalanceEvents.length - 1];
    const latestOperatorEvent = operatorEvents[operatorEvents.length - 1];
    
    // fetch rebalance confirmations if latestRebalanceEvent changes with useEffect
    useEffect(() => {
        fetchRebalanceConfirmations();
    }, [latestRebalanceEvent]);

    return (
        <Flex direction='column' p='8px 16px 16px' height={'100%'}>
            <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="bold">Latest Rebalance Event:</Text>
                {latestRebalanceEvent && (
                    <Box p={2} shadow='md' borderWidth='1px'>
                        <Text>Rebalance Number: {latestRebalanceEvent.args?.rebalanceNum.toString()}</Text>
                        <Text>Confirmations: {rebalanceConfirmations}</Text>
                        {/* Map over newComponents array and render each address */}
                        <Text>New Components:</Text>
                        <ul>
                            {latestRebalanceEvent.args?.newComponents.map((component: string, idx: number) => (
                                <li key={idx}>{component}</li>
                            ))}
                        </ul>
                        {/* More details of latestRebalanceEvent... */}
                    </Box>
                )}

                <Text fontSize="lg" fontWeight="bold">Latest New Operator Event:</Text>
                {latestOperatorEvent && (
                    <Box p={2} shadow='md' borderWidth='1px'>
                        <Text>New Operator Address: {latestOperatorEvent.args?.newOperator}</Text>
                        {/* More details of latestOperatorEvent... */}
                    </Box>
                )}

                <Divider />

                <Checkbox isChecked={approveRebalance} onChange={(e) => setApproveRebalance(e.target.checked)}>
                    Approve Rebalance
                </Checkbox>
                <Checkbox isChecked={approveOperator} onChange={(e) => setApproveOperator(e.target.checked)}>
                    Approve New Operator
                </Checkbox>
                <Checkbox isChecked={executeRebalance} onChange={(e) => setExecuteRebalance(e.target.checked)}>
                    Execute Rebalance
                </Checkbox>
                <Checkbox isChecked={executeOperator} onChange={(e) => setExecuteOperator(e.target.checked)}>
                    Execute New Operator
                </Checkbox>

                <Button colorScheme="blue" onClick={handleApprove} isDisabled={!approveRebalance && !approveOperator}>
                    Approve
                </Button>
                <Button colorScheme="blue" onClick={handleExecute} isDisabled={!executeRebalance && !executeOperator}>
                    Execute
                </Button>
            </VStack>
        </Flex>
    );
};

export default TransactionContainer;
