import React, { useMemo } from 'react';
import Nav from './components/Nav';
import Notifications from './components/Notifications';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import {
	ConnectionProvider,
	WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
	getLedgerWallet,
	getPhantomWallet,
	getSlopeWallet,
	getSolflareWallet,
	getSolletExtensionWallet,
	getSolletWallet,
	getTorusWallet,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

export const App = () => {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const wallets = useMemo(
		() => [
			getPhantomWallet(),
			getSlopeWallet(),
			getSolflareWallet(),
			getTorusWallet(),
			getLedgerWallet(),
			getSolletWallet({ network }),
			getSolletExtensionWallet({ network }),
		],
		[network]
	);
	return (
		<div>
			<ConnectionProvider endpoint={endpoint}>
				<WalletProvider wallets={wallets} autoConnect>
					<Nav />
					<Routes>
						<Route exact path="/" element={<Home />}></Route>
						<Route
							path="/notifications"
							element={<Notifications />}
						></Route>
					</Routes>
				</WalletProvider>
			</ConnectionProvider>
		</div>
	);
};

export default App;
