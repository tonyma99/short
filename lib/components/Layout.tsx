import type { PropsWithChildren } from 'react'
import Head from 'next/head'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Short</title>
        <meta name="description" content="A simple URL shortener." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {children}
    </>
  )
}
