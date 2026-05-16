import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every page in the web app.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="bn">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />

        {/* 
          Disable body scrolling on web. This makes ScrollView components work as expected. 
        */}
        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveStyles = `
  body {
    background-color: #F8FAFC;
  }
  @media (prefers-color-scheme: dark) {
    body {
      background-color: #0F172A;
    }
  }

  /* Ensure the app takes full height and doesn't get cut off by browser bars */
  html, body, #root {
    height: 100%;
    height: -webkit-fill-available;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  /* Fix for invisible icons by forcing font-display */
  @font-face {
    font-family: 'Ionicons';
    src: url('/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf');
    font-display: block;
  }
`;
