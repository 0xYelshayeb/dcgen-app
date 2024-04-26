import React from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import ConstituentWeights from './ConstituentWeights'; // Import ConstituentWeights

const InfoSection = () => {
    return (
        <VStack mt='20' spacing={20} align="stretch">
            <ConstituentWeights /> 
            <Box>
                <Heading size="sm" mb={4}>Methodology</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) epitomizes precision in tracking the Ethereum ecosystem, focusing on the top 30 governance tokens through a market capitalization-weighted approach. Rebalanced bi-monthly, it employs the Laspeyres index model for accurate market representation, ensuring each token's inclusion adheres to stringent international token classification standards. This methodology not only guarantees a real-time reflection of market dynamics but also upholds the highest safety and compliance standards, providing investors with a reliable and comprehensive market benchmark.</Text>
            </Box>
            <Box>
                <Heading size="sm" mb={4}>Security</Heading>
                <Text fontSize="sm">The DCgen Governance Core ($DCG) is anchored in security, built upon the rigorously audited SetProtocol to ensure utmost safety in smart contract execution (details at SetProtocol's Security Documentation). While we are committed to security and precision, it's important for investors to recognize that all financial products, including $DCG, are subject to market risks and potential losses. We advise investors to carefully consider their risk appetite and investment goals when engaging with the index.</Text>
            </Box>
        </VStack>
    );
};

export default InfoSection;