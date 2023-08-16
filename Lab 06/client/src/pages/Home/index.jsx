import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Characters from "./characters.png";
import { useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	return (
		<Box>
			<Typography
				textAlign="center"
				variant="h2"
				component="h1"
				textTransform="uppercase"
				gutterBottom
			>
				Marvel Characters
			</Typography>
			<Typography textAlign="center" variant="h5" component="p">
				This website lists all the Marvel characters from Marvel API. You can
				browse through the list, search for a character and collect them in one
				of your collectors.
			</Typography>
			<br />
			<Typography textAlign="center" variant="h5" component="p">
				Start by creating a collector if you haven't already and start
				collecting!
			</Typography>
			<Stack
				direction="row"
				justifyContent="center"
				gap={6}
				sx={{
					mt: 8,
				}}
			>
				<Button
					variant="outlined"
					size="large"
					sx={{
						fontSize: "1.2rem",
					}}
					endIcon={<OpenInNewIcon />}
					onClick={() => {
						navigate("/collectors");
					}}
				>
					View Collectors
				</Button>
				<Button
					variant="contained"
					size="large"
					sx={{
						fontSize: "1.2rem",
					}}
					endIcon={<OpenInNewIcon />}
					onClick={() => {
						navigate("/marvel-characters/page/1");
					}}
				>
					Browse Characters
				</Button>
			</Stack>
			<Box
				sx={{
					zIndex: -10,
					position: "fixed",
					bottom: -50,
					left: 0,
					right: 0,
					opacity: 0.1,
				}}
			>
				<img
					src={Characters}
					alt="marvel characters"
					style={{
						width: "100%",
					}}
				/>
			</Box>
		</Box>
	);
}

export default Home;
