import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const pages = [
	{
		title: "Home",
		route: "/",
	},
	{
		title: "My Likes",
		route: "/my-likes",
	},
	{
		title: "My Locations",
		route: "/my-locations",
	},
	{
		title: "New Location",
		route: "/new-location",
	},
	{
		title: "Top Ten",
		route: "/distance",
	},
];

function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
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
							justifyContent: "center",
							gap: 4,
						}}
					>
						{pages.map((page) => {
							const isActive = location.pathname === page.route;
							let btnStyles = {
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
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}

export default Navbar;
