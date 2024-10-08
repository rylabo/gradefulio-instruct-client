import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { makeServer } from './mocks/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

// if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
//   console.log(process.env.NODE_ENV)
//   makeServer({ environment: process.env.NODE_ENV });
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
