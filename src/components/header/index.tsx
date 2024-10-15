import { Box, Flex, Spacer, Text } from '@chakra-ui/react'

import { Connect } from './connect'
import { Logo } from './logo'
import { colors } from '@/lib/styles/colors'

const Header = () => {
  return (
    <Flex
      as='header'
      direction='column'  // Add this line to stack items vertically
      backdropFilter='saturate(120%) blur(20px)'
      p="0"
      position='fixed'
      top='0px'
      w='100%'
      zIndex='2'
    >
<Box w='100%' bg={colors.dcBlue} color='white' textAlign='center' p='8px' fontStyle='italic'>
  This product is currently in its beta phase. Use at your own risk.
</Box>

      <Flex align='center' justifyContent='space-between' w='100%' padding={"32px"}>
        <Flex marginRight={['', '', '', '20px']}>
          <Logo />
        </Flex>
        <Spacer />
        <Connect />
      </Flex>
    </Flex>
  )
}

export default Header
