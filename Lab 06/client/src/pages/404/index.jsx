import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Spiderman from "./spiderman.png";
import FarFromHome from "./far-from-home.png";

function NotFound() {
	const navigate = useNavigate();
	const handleNavigate = () => {
		navigate("/");
	};

	return (
		<Box>
			<img
				className="not-found__spiderman"
				style={{
					height: "100%",
					objectFit: "contain",
				}}
				src={Spiderman}
				alt="spiderman"
			/>
			<Stack direction="row">
				<Box
					sx={{
						width: "70%",
					}}
				/>
				<Stack
					justifyContent="center"
					alignItems="flex-start"
					sx={{
						width: "100%",
						height: "calc(90vh - 128px)",
					}}
				>
					<Typography variant="h3" component="h1" gutterBottom>
						404 PAGE NOT FOUND
					</Typography>
					<Stack direction="row" gap={1} alignItems="center">
						<Typography variant="h5" component="p">
							Looks like you've come
						</Typography>
						<img
							src={FarFromHome}
							alt="Far From Home"
							style={{
								height: "24px",
							}}
						/>
					</Stack>
					<Button
						sx={{
							mt: 2,
						}}
						variant="outlined"
						size="large"
						onClick={handleNavigate}
					>
						Go Home
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default NotFound;
