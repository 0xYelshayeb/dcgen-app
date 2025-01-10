import React from 'react';
import { Box, Flex, Heading, VStack, Text, Icon, IconButton, useClipboard } from '@chakra-ui/react';
import { MdOutlineAccessTime, MdOutlineAccountBalanceWallet, MdOutlineInsertLink, MdOutlineSecurity, MdOutlineSwapHorizontalCircle, MdOutlineCalendarToday, MdContentCopy } from 'react-icons/md'; // New icons from Material Design Icons
import ConstituentWeights from './ConstituentWeights';
import { setTokenAddress } from '@/constants/contracts';
import { blueLogo } from '@/lib/utils/assets';

const InfoSection = ({ product }) => {

    const contractAddress = setTokenAddress;
    const { onCopy } = useClipboard(contractAddress);

    return (
        <VStack mt='20' spacing={20} align="stretch">
            <ConstituentWeights product={product}/>

            <Box>
                <Heading size="sm" mb={6}>Index Characteristics</Heading>
                <Flex wrap="wrap" gap={5} justify="space-between">
                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineAccessTime} boxSize={6} mr={4} />
                        <Box>
                            <Text mb={2}>Capitalization-weighted</Text>
                            <Text fontSize="sm" color={'GrayText'}>The index allocates assets based on market capitalization.</Text>
                        </Box>
                    </Flex>

                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineCalendarToday} boxSize={6} mr={4} />
                        <Box>
                            <Text mb={2}>Quarterly Rebalancing</Text>
                            <Text fontSize="sm" color={'GrayText'}>Assets are rebalanced every quarter to maintain optimal allocation.</Text>
                        </Box>
                    </Flex>

                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineAccountBalanceWallet} boxSize={6} mr={4} />
                        <Box>
                            <Text mb={2}>Arbitrum Network</Text>
                            <Text fontSize="sm" color={'GrayText'}>The index operates on the Arbitrum Layer 2 blockchain.</Text>
                        </Box>
                    </Flex>

                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineSwapHorizontalCircle} boxSize={6} mr={4} />
                        <Box flex="1">
                            <Text mb={2}>{`${contractAddress.slice(0, 7)}...`}</Text>
                            <Text fontSize="sm" color={'GrayText'}>
                                Smart contract address for direct on-chain interaction.
                            </Text>
                        </Box>
                        <IconButton
                            icon={<MdContentCopy />}
                            aria-label="Copy Contract Address"
                            onClick={onCopy}
                            variant="ghost" // Use 'ghost' for transparency
                            _focus={{ boxShadow: 'none' }} // Remove focus outline
                            _hover={{ background: 'transparent' }} // Remove hover background
                            _active={{ boxShadow: 'none' }} // Remove active state outline
                            border="none" // No border
                            p="0" // Remove padding for a more compact appearance
                            colorScheme="blue"
                        />
                    </Flex>

                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineSecurity} boxSize={6} mr={4} />
                        <Box>
                            <Text mb={2}>Zero Fees</Text>
                            <Text fontSize="sm" color={'GrayText'}>No platform fees; only standard network gas fees apply.</Text>
                        </Box>
                    </Flex>

                    <Flex align="center" w={{ base: '100%', md: '48%', lg: '48%' }}>
                        <Icon as={MdOutlineInsertLink} boxSize={6} mr={4} />
                        <Box>
                            <Text mb={2}>Direct Smart Contract Interaction</Text>
                            <Text fontSize="sm" color={'GrayText'}>Interact seamlessly with the index through DCgen&apos;s secure, on-chain smart contracts.</Text>
                        </Box>
                    </Flex>
                </Flex>
            </Box>

            <Box>
                <Heading size="sm" mb={6}>How to Invest</Heading>
                <VStack align="stretch" spacing={6}>
                    <Flex align="center">
                        <Box fontWeight="bold" fontSize="lg" mr={4}>1</Box>
                        <Box>
                            <Text mb={2}>Connect Your Wallet</Text>
                            <Text fontSize="sm" color={'GrayText'}>Link your Arbitrum-compatible wallet to get started.</Text>
                        </Box>
                    </Flex>
                    <Flex align="center">
                        <Box fontWeight="bold" fontSize="lg" mr={4}>2</Box>
                        <Box>
                            <Text mb={2}>Issue $DCA with $WETH</Text>
                            <Text fontSize="sm" color={'GrayText'}>Issue $DCA tokens directly through our smart contracts with $WETH. No DEX interaction necessary.</Text>
                        </Box>
                    </Flex>
                    <Flex align="center">
                        <Box fontWeight="bold" fontSize="lg" mr={4}>3</Box>
                        <Box>
                            <Text mb={2}>Receive $DCA in Your Wallet</Text>
                            <Text fontSize="sm" color={'GrayText'}>Once the transaction is complete, your $DCA tokens will appear in your wallet. You can track your assets value on our application interface.</Text>
                        </Box>
                    </Flex>
                </VStack>
            </Box>
        </VStack>
    );
};

export default InfoSection;
