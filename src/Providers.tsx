import {PrivyProvider} from '@privy-io/react-auth';
import { base } from "viem/chains";

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID as string}
      // value={process.env.REACT_APP_PRIVY_APP_SECRET as string}
      config={{
        defaultChain: base,
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'wallet', 'google'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
