import { Flex, Link, Text } from '@chakra-ui/react'

import { colors, useColorStyles } from '@/lib/styles/colors'

const Footer = () => {
  const { styles } = useColorStyles()
  return (
    <Flex
      flexDir={'column'}
      alignItems='center'
      m={[
        '80px auto 64px',
        '96px auto 64px',
        '96px auto 64px',
        '96px auto 64px',
      ]}
      w='100vw'
    >
      <Flex
        direction='column'
        p={['32px', '32px', '32px', 0]}
        w={['100%', '100%', '100%', '1024px']}
      >
        <Flex mb={'45px'}>
          <Disclaimer />
        </Flex>
        <Links textColor={styles.text2} />
      </Flex>
    </Flex>
  )
}

const Disclaimer = () => (
  <Flex direction='column'>
    <Text fontSize={'2xs'} textColor={colors.icGray3}>
      Disclaimer: DCgen Governance Core ($DCA) is built upon the rigorously audited SetProtocol to ensure utmost safety in smart contract execution (details at SetProtocol's Security Documentation). The information provided here is solely for informational purposes and does not constitute legal, tax, investment, financial, or other advice. Actions should not be taken or withheld based on the content here or any other information we provide at any time, including but not limited to blog posts, data, articles, third-party links, Discord interactions, news feeds, tutorials, tweets, and videos. It is recommended that you consult with a licensed and qualified professional for independent advice relevant to financial, legal, technical, or other decisions. While we are committed to security and precision, it's important to recognize that all financial products, including $DCA, are subject to market risks and potential losses. We advise investors to carefully consider their risk appetite and investment goals when engaging with any of DCgen's products.
      <br />
      <br />
      You are prohibited from purchasing or otherwise acquiring our restricted token products if you are a U.S. person, which includes being a citizen, tax resident, green card holder, or someone incorporated, owned, or controlled by, located in, or operating from a registered office or principal business location within the United States. Additionally, this restriction applies if you are located in any jurisdiction where the offering, sale, or purchase of our token products is considered unlawful, prohibited, or unauthorized. The term "Restricted Person" extends to any individual or entity such as a firm, company, partnership, trust, corporation, governmental body, or any other incorporated or unincorporated organization existing under the laws of a jurisdiction where engaging with our token products is unlawful, prohibited, or unauthorized.
      <Link
        target={'_blank'}
        href='https://indexcoop.com/tokens-restricted-for-restricted-persons'
        textDecoration={'underline'}
      >
        here
      </Link>{' '}
      to view the list of Tokens Restricted for Restricted Persons. You shall
      read the{' '}
      <Link
        target={'_blank'}
        href='https://indexcoop.com/legal/terms-of-service'
        textDecoration={'underline'}
      >
        Terms of Service
      </Link>{' '}
      and use our Website in compliance with the Terms of Service.
    </Text>
  </Flex>
)

const Links = ({ textColor }: { textColor: string }) => (
  <Flex
    direction={['column', 'column', 'column', 'row']}
    fontSize={'sm'}
    textColor={colors.icGray3}
  >
    <Flex direction={'column'} mr='4'>
      <Link
        color={textColor}
        href='https://legacyproducts.indexcoop.com/'
        isExternal
      >
        <Text color={textColor}>Legacy Products</Text>
      </Link>
      <Link
        color={textColor}
        href='https://archive.indexcoop.com/liquidity-mining'
        isExternal
      >
        <Text color={textColor}>
          Liquidity Mining
          <br />
          (discontinued)
        </Text>
      </Link>
    </Flex>
    <Flex direction={'column'} ml={[0, 0, 0, 20]} mr='4' mt={[8, 0, 0, 0]}>
      <Link
        color={textColor}
        href='https://docs.indexcoop.com/index-coop-community-handbook/protocols/security'
        isExternal
      >
        <Text color={textColor}>Audits</Text>
      </Link>
      <Link
        color={textColor}
        href='https://immunefi.com/bounty/indexcoop/'
        isExternal
      >
        <Text color={textColor}>Bug Bounty</Text>
      </Link>
      <Link
        color={textColor}
        href='https://github.com/IndexCoop/index-coop-smart-contracts'
        isExternal
      >
        <Text color={textColor}>Contracts</Text>
      </Link>
      <Link color={textColor} href='https://github.com/IndexCoop' isExternal>
        <Text color={textColor}>GitHub</Text>
      </Link>
    </Flex>
    <Flex direction={'column'} ml={[0, 0, 0, 20]} mr='4' mt={[8, 0, 0, 0]}>
      <Link
        color={textColor}
        href='https://index-coop.notion.site/Index-Coop-Brand-Resources-16bfd8ba832046948bf747b4dc88f899'
        isExternal
      >
        <Text color={textColor}>Press Kit</Text>
      </Link>
      <Link color={textColor} href='https://indexcoop.com/legal/privacy-policy'>
        <Text color={textColor}>Privacy Policy</Text>
      </Link>
      <Link
        color={textColor}
        href='https://indexcoop.com/legal/terms-of-service'
      >
        <Text color={textColor}>Terms of Service</Text>
      </Link>
      <Link
        color={textColor}
        href='https://indexcoop.com/legal/tokens-restricted-for-us-persons'
      >
        <Text color={textColor}>Tokens Restricted for US Persons</Text>
      </Link>
    </Flex>
  </Flex>
)

export default Footer
