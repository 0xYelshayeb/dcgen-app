import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Image,
    HStack,
    VStack,
    Heading,
    Divider,
    useColorModeValue,
    Flex
} from '@chakra-ui/react';
import axios from 'axios';
import PieChart from './PieChart'; // Assume this is your custom pie chart component

const TokenDetail = ({ name, image, constituency, color }) => {
    const bg = useColorModeValue('gray.100', 'gray.700');

    return (
        <HStack borderRadius="12" alignItems="center" p={2} width="full" justify="space-between">
            <HStack spacing={2}>
                <Image boxSize="45px" objectFit="cover" src={image} alt={name} borderRadius="50%" />
                <VStack alignItems="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm" color={color}>{name}</Text>
                </VStack>
            </HStack >
            <VStack alignItems="start" spacing={1}>
                <Text fontWeight="bold" fontSize="sm" color={color}>{constituency}</Text>
            </VStack>
        </HStack>
    );
};

const InfoSection = () => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get('https://api.dcgen.finance/constituents');
                const sortedTokens = response.data.sort((a, b) => b['Allocation %'] - a['Allocation %']);
                const topThreeTokens = sortedTokens.slice(0, 3);
                const othersPercentage = sortedTokens.slice(3).reduce((acc, token) => acc + token['Allocation %'], 0);
                const tokensWithOthers = topThreeTokens;

                if (sortedTokens.length > 3) {
                    tokensWithOthers.push({
                        Name: 'Others',
                        'Allocation %': othersPercentage,
                        Color: '#E0E0E0',
                        logoURI: 'https://dcgen.finance/others.svg',
                    });
                }

                setTokens(tokensWithOthers);
            } catch (error) {
                console.error('Error fetching tokens:', error);
            }
        };

        fetchTokens();
    }, []);

    return (
        <VStack spacing={8} align="stretch">
            <Heading size="sm" mb={4}>Asset Allocation</Heading>
            <Flex>
                <Box flex="5.5">
                    <PieChart tokens={tokens} />
                </Box>
                <VStack flex="4.5" align="stretch">
                    {tokens.map((token, index) => (
                        <TokenDetail
                            key={index}
                            name={token.Name}
                            image={token.logoURI}
                            color={token.Color}
                            constituency={`${token['Allocation %'].toFixed(2)}%`} // Accessing Allocation % with bracket notation
                        />
                    ))}
                </VStack>
            </Flex>
            <Divider />
            <Box>
                <Heading size="sm" mb={2}>Methodology</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) epitomizes precision in tracking the Ethereum ecosystem, focusing on the top 30 governance tokens through a market capitalization-weighted approach. Rebalanced bi-monthly, it employs the Laspeyres index model for accurate market representation, ensuring each token&apos;s inclusion adheres to stringent international token classification standards. This methodology not only guarantees a real-time reflection of market dynamics but also upholds the highest safety and compliance standards, providing investors with a reliable and comprehensive market benchmark.</Text>
            </Box>
            <Box>
                <Heading size="sm" mb={2}>Security</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) is anchored in security, built upon the rigorously audited SetProtocol to ensure utmost safety in smart contract execution (details at SetProtocol&apos;s Security Documentation). While we are committed to security and precision, it&apos;s important for investors to recognize that all financial products, including $DCG, are subject to market risks and potential losses. We advise investors to carefully consider their risk appetite and investment goals when engaging with the index.</Text>
            </Box>
        </VStack>
    );
};

export default InfoSection;
