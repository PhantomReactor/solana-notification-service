import { Connection, PublicKey } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';
import idl from '../assets/send_notification.json';
import { web3 } from '@project-serum/anchor';
import { deserialize } from 'borsh';
import axios from 'axios';
import base58 from 'bs58';

const sendNotification = async ({ title, message, wallet, destination }) => {
	const destinationKey = new PublicKey(destination);
	const destinationValid = PublicKey.isOnCurve(destinationKey.toBuffer());
	if (!destinationValid) {
		return 'Please enter a valid destination address';
	}
	const preflightCommitment = 'processed';
	const commitment = 'processed';
	const programID = new PublicKey(idl.metadata.address);
	const connection = new Connection(
		'https://api.devnet.solana.com',
		commitment
	);
	const provider = new Provider(connection, wallet, {
		preflightCommitment,
		commitment,
	});
	const program = new Program(idl, programID, provider);
	const notificationAccount = web3.Keypair.generate();
	let users = await getSubscribedUsers(connection);

	if (users.length === 0) {
		return 'No wallets found to send notifications';
	}
	users = users.filter(
		(user) => base58.encode(user.user_key).toString() === destination
	);

	if (users.length === 0) {
		return 'Wallet not subscribed';
	}
	const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
	const fcmKey = process.env.REACT_APP_FCM_KEY;

	const headers = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `key=${fcmKey}`,
		},
	};
	await program.rpc.sendNotification(title, message, {
		accounts: {
			notification: notificationAccount.publicKey,
			author: provider.wallet.publicKey,
			recipient: destinationKey,
			systemProgram: web3.SystemProgram.programId,
		},
		signers: [notificationAccount],
	});
	const notificationAcc = await program.account.notification.fetch(
		notificationAccount.publicKey
	);

	for (const user of users) {
		const fcmToken = user.fcm_token;
		console.log(fcmToken);
		const notification = buildNotification(
			notificationAcc.title,
			notificationAcc.message,
			fcmToken
		);
		const response = await axios.post(fcmUrl, notification, headers);
		console.log(response);
		if (response.status !== 200) {
			return `Something went wrong while sending notifications to ${user.user_key.toString()}`;
		}
	}

	return 'Notification sent';
};

class User {
	constructor(properties) {
		Object.keys(properties).forEach((key) => {
			this[key] = properties[key];
		});
	}

	static schema = new Map([
		[
			User,
			{
				kind: 'struct',
				fields: [
					['user_key', [32]],
					['fcm_token', 'string'],
					['admin', [32]],
				],
			},
		],
	]);
}

function buildNotification(title, message, fcmToken) {
	return {
		notification: {
			title: title,
			body: message,
			sound: 'default',
		},
		to: fcmToken,
		priority: 'high',
	};
}

const getSubscribedUsers = async (connection) => {
	const usersProgramId = new PublicKey(
		'34Vf55T37KWDg4Ab53BSfDDsoCAPAQdRPDjiurrjQ6UE'
	);
	let userAccounts = await connection.getProgramAccounts(usersProgramId);
	const users = [];
	userAccounts.forEach((e) => {
		const u = deserialize(User.schema, User, e.account.data);
		const userExists = users.some((user) => user.fcm_token === u.fcm_token);
		if (!userExists) {
			users.push(u);
		}
	});
	return users;
};

export default sendNotification;
