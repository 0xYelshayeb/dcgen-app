import React, { useState, useEffect } from 'react';
import {
    Box, Heading, VStack, Divider, Flex, Text
} from '@chakra-ui/react';
import axios from 'axios';
import ConstituentDetail from './ConstituentDetail'; // Ensure this component is imported

const InfoSection = () => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get('https://api.dcgen.finance/constituents');
                const sortedTokens = response.data.sort((a, b) => b['Allocation %'] - a['Allocation %']);
                setTokens(sortedTokens.slice(0, 5)); // Only store the top 5 tokens directly
            } catch (error) {
                console.error('Error fetching tokens:', error);
            }
        };

        fetchTokens();
    }, []);

    return (
        <VStack spacing={8} align="stretch">
            <Heading size="sm" mt={20}>Constituent Weights</Heading>
            <Flex direction="column" gap={4} mb={20}>
                {tokens.map((token, index) => (
                    <ConstituentDetail
                        key={index}
                        name={token.Name}
                        percentage={token['Allocation %'].toFixed(2)}
                    />
                ))}
            </Flex>
            <Box mb={20}>
                <Heading size="sm" mb={4}>Methodology</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) epitomizes precision in tracking the Ethereum ecosystem, focusing on the top 30 governance tokens through a market capitalization-weighted approach. Rebalanced bi-monthly, it employs the Laspeyres index model for accurate market representation, ensuring each token's inclusion adheres to stringent international token classification standards. This methodology not only guarantees a real-time reflection of market dynamics but also upholds the highest safety and compliance standards, providing investors with a reliable and comprehensive market benchmark.</Text>
            </Box>
            <Box mb={20}>
                <Heading size="sm" mb={4} >Security</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) is anchored in security, built upon the rigorously audited SetProtocol to ensure utmost safety in smart contract execution (details at SetProtocol's Security Documentation). While we are committed to security and precision, it's important for investors to recognize that all financial products, including $DCG, are subject to market risks and potential losses. We advise investors to carefully consider their risk appetite and investment goals when engaging with the index.</Text>
            </Box>
        </VStack>
    );
};

export default InfoSection;