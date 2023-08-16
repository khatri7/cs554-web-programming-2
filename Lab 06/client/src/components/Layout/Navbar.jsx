import {
	AppBar,
	Box,
	Button,
	Container,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./logo.png";
import { useSelector } from "react-redux";

const pages = [
	{
		title: "Home",
		route: "/",
	},
	{
		title: "Marvel Characters",
		route: "/marvel-characters/page/1",
		template: "/marvel-characters/page/",
	},
	{
		title: "Collectors",
		route: "/collectors",
	},
];

function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const collectors = useSelector((state) => state.collectors);
	return (
		<AppBar
			sx={{
				backgroundColor: "rgba(255,255,255,0.8)",
				backdropFilter: "blur(20px)",
			}}
			position="sticky"
		>
			<Container>
				<Toolbar disableGutters>
					<Box
						sx={{
							flexGrow: 1,
							minHeight: 64,
							display: { xs: "none", md: "flex" },
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Box height={50}>
							<img
								alt="Marvel Characters"
								src={Logo}
								style={{
									height: "100%",
								}}
							/>
						</Box>
						<Stack direction="row" gap={4}>
							{pages.map((page) => {
								const isActive = page.template
									? location.pathname.includes(page.template)
									: location.pathname === page.route;
								let btnStyles = {
									height: 64,
									py: 2,
									display: "block",
									borderRadius: 0,
									color: "black",
								};
								if (isActive)
									btnStyles = {
										...btnStyles,
										borderTop: (theme) =>
											`3px solid ${theme.palette.primary.main}`,
										color: (theme) => theme.palette.primary.main,
										pt: "13px",
									};
								return (
									<Button
										key={page.title}
										onClick={() => {
											navigate(page.route);
										}}
										sx={btnStyles}
									>
										{page.title}
									</Button>
								);
							})}
						</Stack>
						<Stack>
							<Typography variant="subtitle2" color="black" component="p">
								Currently Selected Collector:
							</Typography>
							<Typography color="black" variant="h6" component="p">
								{collectors.selected}
							</Typography>
						</Stack>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
