import Head from 'next/head'
import '../styles/globals.css'
import { AuthProvider } from '../contexts/Auth'
import { StatsProvider } from '../contexts/Stats'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import React, { type JSX } from 'react'

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any
  pageProps: any
}): JSX.Element {
  return (
    <React.StrictMode>
      <Head>
        <title>Typeland</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <StatsProvider>
          <ChakraProvider value={defaultSystem}>
            <Component {...pageProps} />
          </ChakraProvider>
        </StatsProvider>
      </AuthProvider>
    </React.StrictMode>
  )
}
