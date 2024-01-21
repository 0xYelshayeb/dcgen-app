import Image from 'next/image'

import { Link } from '@chakra-ui/react'

import { useICColorMode } from '@/lib/styles/colors'
import { LogoBlack, LogoWhite } from '@/lib/utils/assets'

export const Logo = () => {
  const { isDarkMode } = useICColorMode()
  const logo = isDarkMode ? LogoWhite : LogoBlack
  return (
    <Link
      href='https://dcgen.finance/'
      _hover={{
        textDecoration: 'none',
      }}
      flexGrow={1}
    >
      <Image alt='Index Coop Logo' src={logo} height={32} width={90} />
    </Link>
  )
}
