import React from 'react';
import {
	WalletModalProvider,
	WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import '../App.css';
require('@solana/wallet-adapter-react-ui/styles.css');

const MyWallet = () => {
	return (
		<div>
			<WalletModalProvider>
				<WalletMultiButton className="wallet-container" />
			</WalletModalProvider>
		</div>
	);
};

export default MyWallet;
