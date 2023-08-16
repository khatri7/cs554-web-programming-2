import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Stack,
	Typography,
} from "@mui/material";
import React from "react";
import NoImage from "../../assets/images/no-image.jpeg";
import { OpenInNew } from "@mui/icons-material";

function EventCard({ title, image, onClick, children }) {
	return (
		<Card
			raised
			sx={{
				height: "100%",
			}}
		>
			<Stack
				sx={{
					height: "100%",
				}}
				justifyContent="space-between"
			>
				<Box>
					<CardMedia
						component="img"
						height="150"
						image={image || NoImage}
						alt={title}
					/>
					<CardContent>
						<Typography gutterBottom variant="h6" component="div">
							{title}
						</Typography>
						{children}
					</CardContent>
				</Box>
				<Box sx={{ p: 1 }}>
					<Button onClick={onClick}>
						VIEW{"  "}
						<OpenInNew />
					</Button>
				</Box>
			</Stack>
		</Card>
	);
}

export default EventCard;
