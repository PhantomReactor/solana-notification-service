import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Sns } from '../target/types/sns';
import * as assert from 'assert';

describe('sns', () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.Provider.env());

	const program = anchor.workspace.Sns as Program<Sns>;

	it('can send notification data', async () => {
		const notification = anchor.web3.Keypair.generate();
		const authority = anchor.web3.Keypair.generate();
		const sender = program.provider.wallet.publicKey;
		await program.rpc.sendNotification('test title', 'test message', {
			accounts: {
				notification: notification.publicKey,
				sender,
				authority: authority.publicKey,
				systemProgram: anchor.web3.SystemProgram.programId,
			},
			signers: [notification],
		});

		const notificationAccount = await program.account.notification.fetch(
			notification.publicKey
		);
		console.log(notificationAccount.authority);
		assert.equal(
			notificationAccount.authority.toBase58(),
			authority.publicKey.toBase58()
		);
		assert.equal(notificationAccount.title, 'test title');
		assert.equal(notificationAccount.message, 'test message');
	});
});
