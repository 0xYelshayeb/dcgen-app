import Script from 'next/script'
import { Providers } from './providers'

// For images just place the appropriate image file in this folder.
// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
  title: 'DCgen.finance',
  description:
    'Buy investment product with zero fees.',
  type: 'website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
