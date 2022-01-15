import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import '../App.css';
import { ReactComponent as NotificationLogo } from '../assets/notification.svg';

const Home = () => {
	return (
		<ConatinerDiv>
			<StyledDiv>
				<div>
					<h1>
						Send <span>notifications</span> on solana with
					</h1>
					<h1> SNS protocol</h1>
				</div>

				<Link to="/notifications">
					<button className="wallet-container">Send</button>
				</Link>
			</StyledDiv>
			<NotificationLogo />
		</ConatinerDiv>
	);
};

const StyledDiv = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: center;
	gap: 3rem;
	height: 90vh;
	h1 {
		color: white;
		font-size: 4rem;
	}
	button {
		width: 10rem;
	}
`;

const ConatinerDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	margin-left: 20rem;
	height: 90vh;
`;

export default Home;
