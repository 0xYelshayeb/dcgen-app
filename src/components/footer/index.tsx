import { Flex, Link, Text, IconButton } from '@chakra-ui/react';
import { FaDiscord, FaTelegram, FaTwitter, FaGithub, FaBook } from 'react-icons/fa';
import { colors } from '@/lib/styles/colors';

const Footer = () => {
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
        <Flex justifyContent='center' w={['100%', '100%', 'auto']}>
          <IconButton
            aria-label='Discord'
            as='a'
            href='#'
            icon={<FaDiscord />}
            fontSize='24px'  // Set the desired font size for larger icons
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
            aria-label='Telegram'
            as='a'
            href='#'
            icon={<FaTelegram />}
            fontSize='24px'  // Set the desired font size for larger icons
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
            aria-label='Twitter'
            as='a'
            href='#'
            icon={<FaTwitter />}
            fontSize='24px'  // Set the desired font size for larger icons
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
            fontSize='24px'  // Set the desired font size for larger icons
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
            fontSize='24px'  // Set the desired font size for larger icons
            bg='transparent'
            _focus={{ boxShadow: 'none', outline: 'none' }}
            _hover={{ background: 'transparent' }}
            _active={{ boxShadow: 'none', outline: 'none' }}
            border='none'
            outline='none'
            color='white'
          />
        </Flex>
        <Flex
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
              textDecoration='none'>Twitter</Link>
            <Link href='#' textDecor='underline' mb={1} _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>Telegram</Link>
            <Link href='#' textDecor='underline' _hover={{ textDecoration: 'underline' }}
              textDecoration='none'>Discord</Link>
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
      _hover={{ textDecoration: 'underline' }}
      mt={4}
      textAlign='left'
      >
      Read more about our license
      </Link>
  </Flex>
);

export default Footer;
