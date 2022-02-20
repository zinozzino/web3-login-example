import { config } from '@fortawesome/fontawesome-svg-core';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import '~/styles/globals.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps): JSX.Element {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
