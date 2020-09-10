import Head from 'next/head'
import '../styles/base.css'
import { AuthProvider } from '../contexts/Auth'
import { StatsProvider } from '../contexts/Stats'
import { ThemeProvider, theme } from '@chakra-ui/core'

export default function MyApp({
  Component,
  pageProps,
}: {
  Component: any
  pageProps: any
}): JSX.Element {
  return (
    <>
      <Head>
        <title>Typeland</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <StatsProvider>
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </StatsProvider>
      </AuthProvider>
    </>
  )
}
