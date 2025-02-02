'use client'

import { WagmiConfig } from 'wagmi'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { GTMProvider } from '@elgorditosalsero/react-gtm-hook'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

import theme, { rainbowkitTheme } from '@/lib/styles/theme'
import { chains, wagmiConfig } from '@/lib/utils/wagmi'
import { arbitrum, base } from 'wagmi/chains'


import '@rainbow-me/rainbowkit/styles.css'
import '@/lib/styles/fonts'

const rainbowKitAppInfo = {
  appName: 'DCgen',
  learnMoreUrl: 'https://dcgen.finance',
}

export function Providers({ children }: { children: React.ReactNode }) {
  const gtmParams = {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID ?? '',
  }
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={[arbitrum, base]}
            initialChain={arbitrum}
            theme={rainbowkitTheme}
            appInfo={rainbowKitAppInfo}
          >
            <GTMProvider state={gtmParams}>{children}</GTMProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  )
}
