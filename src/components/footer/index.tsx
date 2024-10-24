import { Flex, Link, Text, IconButton, VStack, Image } from '@chakra-ui/react';
import { FaTwitter, FaGithub, FaBook } from 'react-icons/fa';
import { colors } from '@/lib/styles/colors';
import { LogoWhite } from '@/lib/utils/assets'

const Footer = () => {
  const logo = LogoWhite;
  return (
    <Flex
      flexDir={'column'}
      alignItems='center'
      justifyContent='center'
      bg={colors.dcBlue}
      color='white'
      p='48px'
      w='100vw'
      as="footer"
    >
      <Disclaimer />
      <Flex
        justifyContent={['center', 'center', 'space-between']}
        w={['100%', '100%', '1024px']}
        py={8}
        px={[4, 4, 4]}
        flexWrap="wrap"
      >
        <VStack>
          <Image alt='Index Coop Logo' src={logo} height={16} width={"auto"} />
          <Flex justifyContent='center' w={['100%', '100%', 'auto']}>
            <IconButton
              aria-label='Twitter'
              as='a'
              href='#'
              icon={<FaTwitter />}
              fontSize='24px'
              bg='none'
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _hover={{ background: 'transparent' }}
              _active={{ boxShadow: 'none', outline: 'none' }}
              border='none'
              outline='none'
              mr={2}
              color='white'
            />
            <IconButton
              aria-label='GitHub'
              as='a'
              href='#'
              icon={<FaGithub />}
              fontSize='24px'
              bg='transparent'
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _hover={{ background: 'transparent' }}
              _active={{ boxShadow: 'none', outline: 'none' }}
              border='none'
              outline='none'
              mr={2}
              color='white'
            />
            <IconButton
              aria-label='Research'
              as='a'
              href='#'
              icon={<FaBook />}
              fontSize='24px'
              bg='transparent'
              _focus={{ boxShadow: 'none', outline: 'none' }}
              _hover={{ background: 'transparent' }}
              _active={{ boxShadow: 'none', outline: 'none' }}
              border='none'
              outline='none'
              color='white'
            />
          </Flex>
        </VStack>

        <Flex
          flexBasis={['100%', '100%', '50%']}
          direction={['column', 'row']}
          w={['100%', 'auto']}
          justifyContent='space-around'
          fontSize='sm'
          mt={[8, 0]}
          textAlign={'left'}
        >
          <Flex direction='column' alignItems='flex-start' mr={[0, 16]} color={"white"} textAlign={'left'}>
            <Text fontWeight='bold' mb={2} color={'white'}>Community</Text>
            <Link href='#' textDecor='underline' mb={1} _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>X (Twitter)</Link>
            <Link href='#' textDecor='underline' mb={1} _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>Contact Us</Link>
          </Flex>
          <Flex direction='column' alignItems='flex-start' color={"white"} textAlign={'left'}>
            <Text fontWeight='bold' mb={2} color={"white"}>Resources</Text>
            <Link href='#' textDecor='underline' mb={1} _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>Documentation</Link>
            <Link href='#' textDecor='underline' mb={1} _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>GitHub</Link>
            <Link href='#' textDecor='underline' _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>Research</Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

const Disclaimer = () => (
  <Flex
    direction='column'
    textAlign='center'
    fontSize='xs'
    w={['90%', '80%', '60%']}
    mb={8}
  >
    <Text color={'white'} textAlign={"left"}>
      Disclaimer: DCgen Governance Core ($DCA) is built upon the rigorously audited SetProtocol to ensure utmost safety in smart contract execution (details at SetProtocol&apos;s Security Documentation). The information provided here is solely for informational purposes and does not constitute legal, tax, investment, financial, or other advice. Actions should not be taken or withheld based on the content here or any other information we provide at any time, including but not limited to blog posts, data, articles, third-party links, Discord interactions, news feeds, tutorials, tweets, and videos. It is recommended that you consult with a licensed and qualified professional for independent advice relevant to financial, legal, technical, or other decisions. While we are committed to security and precision, it&apos;s important to recognize that all financial products, including $DCA, are subject to market risks and potential losses. We advise investors to carefully consider their risk appetite and investment goals when engaging with any of DCgens products.
    </Text>
    <br />
    <Text color={"white"} textAlign={"left"}>
      You are prohibited from purchasing or otherwise acquiring our restricted token products if you are a U.S. person, which includes being a citizen, tax resident, green card holder, or someone incorporated, owned, or controlled by, located in, or operating from a registered office or principal business location within the United States. Additionally, this restriction applies if you are located in any jurisdiction where the offering, sale, or purchase of our token products is considered unlawful, prohibited, or unauthorized. The term &quot;Restricted Person&quot; extends to any individual or entity such as a firm, company, partnership, trust, corporation, governmental body, or any other incorporated or unincorporated organization existing under the laws of a jurisdiction where engaging with our token products is unlawful, prohibited, or unauthorized.
    </Text>
    {/* link to /license */}
    <Link
      href='/license'
      color='white'
      textDecoration='underline'
      mt={4}
      textAlign='left'
    >
      Read more about our Disclaimer, Privacy Policy, Terms of Service and Tokens Restricted for Restricted Persons
    </Link>
  </Flex>
);

export default Footer;
