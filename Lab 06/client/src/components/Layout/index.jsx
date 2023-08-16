import React from "react";
import { Container } from "@mui/material";
import Navbar from "./Navbar";
import Alert from "../Alert";

function Layout({ children }) {
	return (
		<>
			<Navbar />
			<Container
				sx={{
					py: 4,
				}}
			>
				{children}
			</Container>
			<Alert />
		</>
	);
}

export default Layout;
