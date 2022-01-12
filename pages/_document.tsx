import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet" key="font" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
