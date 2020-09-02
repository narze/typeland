import Head from 'next/head'
import '../styles/base.css'
import { StatsProvider } from '../contexts/Stats'

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
      <StatsProvider>
        <Component {...pageProps} />
      </StatsProvider>
    </>
  )
}
