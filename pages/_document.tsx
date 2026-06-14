import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#0b0f14" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <body className="min-h-screen antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

