import { useState, useEffect } from 'react';
import { Flex, Checkbox, Button, Box, VStack } from '@chakra-ui/react';
import { ethers } from 'ethers';
import SetTokenAbi from '../../lib/utils/abi/SetToken.json';
import IndexModuleAbI from '../../lib/utils/abi/GeneralIndexModule.json';
import { useWallet } from '../../lib/hooks/useWallet';
import { setTokenAddress } from '@/constants/contracts';
import { indexModuleAddress } from '@/constants/contracts';
import { maxUint256 } from 'viem';

const TradeContainer = () => {

    const componentNames: Record<string, string> = {
        "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0": "UNI",
        "0x9623063377ad1b27544c965ccd7342f7ea7e88c7": "GRT",
        "0x13ad51ed4f1b7e9dc168d8a00cb3f4ddd85efa60": "LDO",
        "0x0c880f6761f1af8d9aa9c466984b80dab9a8c9e8": "PENDLE",
        "0x912ce59144191c1204e64559fe8253a0e49e6548": "ARB",
        "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a": "GMX",
        "0x371c7ec6d8039ff7933a2aa28eb827ffe1f52f07": "JOE",
        "0x18c11fd286c5ec11c3b683caa813b77f5163a122": "GNS",
        "0x3082cc23568ea640225c2467653db90e9250aaa0": "RDNT",
        "0x4e352cf164e64adcbad318c3a1e222e9eba4ce42": "MCB",
        "0x7dd747d63b094971e6638313a6a2685e80c7fb2e": "STFX",
        "0x0341c0c0ec423328621788d4854119b97f44e391": "Silo",
        "0x58b9cb810a68a7f3e1e4f8cb45d1b9b3c79705e8": "NEXT",
        "0xf1264873436a0771e440e2b28072fafcc5eebd01": "KNS",
        "0x82af49447d8a07e3bd95bd0d56f35241523fbab1": "WETH"
    }


    const [components, setComponents] = useState<string[]>([]);
    const [selectedComponents, setSelectedComponents] = useState<Record<string, boolean>>({});
    const { provider, signer } = useWallet();

    const setTokenAbi = SetTokenAbi.abi;
    const indexModuleAbI = IndexModuleAbI.abi;

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

    const handleCheckboxChange = (component: string) => {
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
                const tx = await contract.trade(setTokenAddress, address, maxUint256);
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
                            <Box as='span' mr={2}>
                                {component}
                            </Box>
                            {componentNames[component.toLowerCase()]}
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