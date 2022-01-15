import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MyWallet from './MyWallet';

const Nav = () => {
	return (
		<StyledNav>
			<h1>
				<Link id="logo" to="/" style={linkStyle}>
					SNS
				</Link>
			</h1>
			<StyledDiv>
				<Link to="/notifications" style={linkStyle}>
					Notifications
				</Link>
				<MyWallet />
			</StyledDiv>
		</StyledNav>
	);
};
const StyledNav = styled.nav`
	min-height: 10vh;
	display: flex;
	margin: auto;
	justify-content: space-between;
	align-items: center;
	padding: 0rem 2rem;
	background: #282828;
	#logo {
		font-size: 2rem;
		font-family: 'Lobster', cursive;
		font-weight: bold;
		color: white;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	jsutify-content: space-around;
	max-width: 100%;
	h4 {
		font-size: 2rem;
		padding-left: 10000rem;
	}
`;

const linkStyle = {
	textDecoration: 'none',
	fontSize: '1.5rem',
	color: 'white',
	padding: '0rem 2rem',
};

export default Nav;
