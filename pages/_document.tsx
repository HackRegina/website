import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="HackRegina is the beginning of a strong and well-known tech community for Regina, SK. The non-profit organization started as a small Slack channel but has begun to grow into a community for software developers to share knowledge and get to know one another."
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
