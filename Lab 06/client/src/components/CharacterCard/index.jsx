import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { collectCharacter, giveUpCharacter } from "../../store/collectors";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NoImage from "../../assets/images/no-image.jpeg";
import { useAlertContext } from "../../contexts/Alert";

function CharacterCard({ character, isSelected = false }) {
	const { name, image, description } = character;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { errorAlert } = useAlertContext();
	const { selected, value } = useSelector((state) => state.collectors);
	const handleCollectGiveUp = () => {
		if (!selected) return errorAlert("No Collector selected");
		if (!isSelected && value[selected].length === 10)
			return errorAlert("Collector is full");
		if (!isSelected) return dispatch(collectCharacter(character));
		return dispatch(giveUpCharacter(character));
	};

	return (
		<Card
			raised
			sx={{
				height: "100%",
				":hover": {
					transform: "scale(1.05)",
				},
				transition: "all 0.5s ease-in-out",
			}}
		>
			<Stack justifyContent="space-between" height="100%">
				<Box>
					<CardMedia
						component="img"
						alt={name}
						height="300"
						image={image === "No Image" ? NoImage : image}
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{description}
						</Typography>
					</CardContent>
				</Box>
				<CardActions>
					<Stack
						direction="row"
						justifyContent="space-between"
						width="100%"
						sx={{
							pb: 1,
						}}
					>
						<Button
							size="large"
							variant={isSelected ? "contained" : "outlined"}
							onClick={handleCollectGiveUp}
						>
							{isSelected ? "Give-Up" : "Collect"}
						</Button>
						<Button
							onClick={() => {
								navigate(`/marvel-characters/${character.id}`);
							}}
						>
							View
						</Button>
					</Stack>
				</CardActions>
			</Stack>
		</Card>
	);
}

export default CharacterCard;
