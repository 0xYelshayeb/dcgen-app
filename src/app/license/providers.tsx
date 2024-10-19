import { BalanceProvider } from '@/lib/providers/Balances'
import { ProtectionProvider } from '@/lib/providers/protection'
import { SelectedTokenProvider } from '@/lib/providers/selected-token-provider'
import { SlippageProvider } from '@/lib/providers/slippage'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { colors } from '@/lib/styles/colors';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SelectedTokenProvider>
      <BalanceProvider>
        <SlippageProvider>
          <ProtectionProvider>
            <RainbowKitProvider chains={[]} theme={darkTheme({
              accentColor: colors.dcBlue,
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
              overlayBlur: 'small',
            })}>
              {children}
            </RainbowKitProvider>
          </ProtectionProvider>
        </SlippageProvider>
      </BalanceProvider>
    </SelectedTokenProvider>
  )
}
