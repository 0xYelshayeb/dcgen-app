import React, { useState, useEffect } from 'react';
import {
    Box, VStack, Heading,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
    Button, useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

import ConstituentDetail from './ConstituentDetail';
import '../../lib/styles/icons/MingCute.css';

const ConstituentWeights = () => {
    const [tokens, setTokens] = useState([]);
    const [allTokens, setAllTokens] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get('https://api.dcgen.finance/constituents');
                console.log(response);
                const sortedTokens = response.data.sort((a, b) => b['Allocation %'] - a['Allocation %']);
                setAllTokens(sortedTokens);
                setTokens(sortedTokens.slice(0, 5));
            } catch (error) {
                console.error('Error fetching tokens:', error);
            }
        };
        fetchTokens();
    }, []);

    const controls = useAnimation();
    const { inView } = useInView({ threshold: 0.8 });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    return (
        <VStack spacing={8} align="stretch">
            <Box width="100%">
                <Heading size="sm" mb={4}>Constituent Weights</Heading>
                <VStack align="left" spacing="4">
                    {tokens.map((token, index) => (
                        <ConstituentDetail
                            key={index}
                            name={token.Name}
                            percentage={token['Allocation %'].toFixed(2)}
                        />
                    ))}
                </VStack>
                <Button fontSize='12px' pl="16px" mt={4} onClick={onOpen} color="#276EF1" borderColor='transparent' backgroundColor="inherit" _hover={{ backgroundColor: 'inherit' }}>
                    Show All
                </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered size="100%">
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent width="70%" marginTop="80px">
                    <ModalHeader fontSize="xl">Constituent Weights</ModalHeader>
                    <ModalBody>
                        <VStack spacing={4} paddingTop="4">
                            {allTokens.map((token, index) => (
                                <ConstituentDetail
                                    key={index}
                                    name={token.Name}
                                    percentage={token['Allocation %'].toFixed(2)}
                                />
                            ))}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default ConstituentWeights;