import { useAnchorWallet } from '@solana/wallet-adapter-react';
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import '../App.css';
import notificationLogo from '../assets/notification.png';
import sendNotification from '../solana/anchorClient';
import { useAlert } from 'react-alert';

const Notifications = () => {
	const wallet = useAnchorWallet();
	const alert = useAlert();
	const [title, setTitle] = useState('');
	const [message, setMessage] = useState('');
	const [destination, setDestination] = useState('');
	const notify = useCallback(
		async (title, message, wallet, destination) => {
			try {
				if (title === '' || message === '') {
					alert.show('title and message are required');
				} else if (wallet === undefined) {
					alert.show('Please connect a wallet');
				} else {
					const response = await sendNotification({
						title,
						message,
						wallet,
						destination,
					});
					setTitle('');
					setMessage('');
					setDestination('');
					alert.show(response);
				}
			} catch (error) {
				console.log(error);
				alert.show('Something went wrong while sending notification');
			}
		},
		[alert]
	);

	return (
		<StyledDiv>
			<h4>
				Please download and install the client apk from{' '}
				<a href="https://github.com/PhantomReactor/solana-notification-service/raw/master/apk/app-release.apk">
					<span>here</span>
				</a>{' '}
				and switch to devnet to receive notifications
			</h4>
			<img src={notificationLogo} alt="notification bell"></img>
			<input
				placeholder="destination address"
				value={destination}
				onChange={(e) => setDestination(e.target.value)}
			/>
			<input
				placeholder="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				placeholder="message"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			></textarea>
			<button
				className="wallet-container"
				onClick={() => notify(title, message, wallet, destination)}
			>
				Send
			</button>
		</StyledDiv>
	);
};

const StyledDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	height: 90vh;
	input {
		all: unset;
		width: 50vh;
		height: 5vh;
		background: #282828;
		border-radius: 14px;
		cursor: text;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		color: white;
	}
	textarea {
		all: unset;
		width: 50vh;
		height: 10vh;
		background: #282828;
		border-radius: 12px;
		cursor: text;
		padding-left: 0.5rem;
		padding-top: 0.5rem;
		white-space: pre-wrap;
		overflow: -moz-hidden-unscrollable;
		overflow: hidden;
		color: white;
	}
	button {
		width: 8rem;
		height: 3rem;
		padding: 0;
		border-radius: 12px;
	}
	img {
		height: 5rem;
	}
	h4 {
		font-size: 2rem;
	}
`;
export default Notifications;
