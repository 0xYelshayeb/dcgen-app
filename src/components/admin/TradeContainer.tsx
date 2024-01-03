import { useState, useEffect } from 'react';
import { Flex, Checkbox, Button, Box, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import SetTokenAbi from '../../lib/utils/abi/SetToken.json';
import IndexModuleAbI from '../../lib/utils/abi/GeneralIndexModule.json';
import { useWallet } from '../../lib/hooks/useWallet';

const TradeContainer = () => {
    const [components, setComponents] = useState([]);
    const [selectedComponents, setSelectedComponents] = useState({});
    const { provider, signer } = useWallet();

    const setTokenAbi = SetTokenAbi.abi;
    const indexModuleAbI = IndexModuleAbI.abi;
    const setTokenAddress = "0x26DE69d01fdB4DA2160777c9b8598F335D2536D4"; // Replace with your SetToken address
    const indexModuleAddress = "0x68C628F95EBeA470447017A7F7E767D2e8Db4952";

    const fetchComponents = async () => {
        const contract = new ethers.Contract(setTokenAddress, setTokenAbi, provider);
        try {
            const components = await contract.getComponents();
            setComponents(components);
        } catch (error) {
            console.error('Error fetching components:', error);
        }
    };

    useEffect(() => {
        fetchComponents();
    }, [provider]);

    const handleCheckboxChange = (component) => {
        setSelectedComponents({
            ...selectedComponents,
            [component]: !selectedComponents[component]
        });
    };

    const executeTrade = async () => {
        const selectedAddresses = Object.keys(selectedComponents).filter(address => selectedComponents[address]);
        // Assuming a 'trade' function exists on your SetToken contract
        for (const address of selectedAddresses) {
            try {
                const contract = new ethers.Contract(indexModuleAddress, indexModuleAbI, signer);
                const tx = await contract.trade(setTokenAddress, address, ethers.utils.parseEther("0")); // Replace with actual trade function and parametersq
                await tx.wait();
                console.log(`Trade executed for ${address}`);
            } catch (error) {
                console.error(`Error trading token ${address}:`, error);
            }
        }
    };

    return (
        <Flex direction='column' p='8px 16px 16px'>
            <VStack spacing={4}>
                {components.map((component, index) => (
                    <Box key={index}>
                        <Checkbox
                            isChecked={selectedComponents[component]}
                            onChange={() => handleCheckboxChange(component)}
                        >
                            {component}
                        </Checkbox>
                    </Box>
                ))}
                <Button colorScheme="blue" onClick={executeTrade}>
                    Execute Trades
                </Button>
            </VStack>
        </Flex>
    );
};

export default TradeContainer;