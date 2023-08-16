import { useQuery } from "@apollo/client";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { GET_CHARACTER_BY_ID } from "../../utils/queries";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useAlertContext } from "../../contexts/Alert";
import NoImage from "../../assets/images/no-image.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { collectCharacter, giveUpCharacter } from "../../store/collectors";

function SingleMarvelCharacter() {
	const { id } = useParams();
	const { errorAlert } = useAlertContext();
	const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, {
		variables: {
			characterId: id,
		},
	});
	const { selected, value } = useSelector((state) => state.collectors);
	const dispatch = useDispatch();

	const selectedItems = selected ? value[selected] : [];

	if (loading) return <Typography>Loading...</Typography>;

	if (error) {
		if (
			error.graphQLErrors
				.map((gqe) => gqe.extensions.code)
				.includes("NOT_FOUND")
		) {
			errorAlert(error.message);
			return <Navigate to="/404" />;
		} else return <Typography>{error.message}</Typography>;
	}

	const character = data.getCharacterByCharacterId;

	const isSelected = selectedItems
		.map((character) => character.id)
		.includes(character.id);

	const handleCollectGiveUp = () => {
		if (!selected) return errorAlert("No Collector selected");
		if (!isSelected && selectedItems.length === 10)
			return errorAlert("Collector is full");
		if (!isSelected) return dispatch(collectCharacter(character));
		return dispatch(giveUpCharacter(character));
	};

	return (
		<Box>
			<img
				src={character.image === "No Image" ? NoImage : character.image}
				alt={character.name}
				style={{
					width: "100%",
					height: "50vh",
					objectFit: "cover",
				}}
			/>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{
					my: 1,
					mb: 2,
				}}
			>
				<Typography variant="h3" component="p">
					{character.name}
				</Typography>
				<Button
					size="large"
					variant={isSelected ? "contained" : "outlined"}
					onClick={handleCollectGiveUp}
				>
					{isSelected ? "Give-Up" : "Collect"}
				</Button>
			</Stack>
			<Typography variant="h4" component="p">
				Description
			</Typography>
			<Typography fontSize="1.2rem">
				{character.description || "No Description"}
			</Typography>
			<Typography
				variant="h4"
				component="p"
				sx={{
					mt: 2,
				}}
			>
				Comics
			</Typography>
			{character.comics.map((comic) => (
				<Typography key={comic} fontSize="1.2rem">
					{comic}
				</Typography>
			))}
		</Box>
	);
}

export default SingleMarvelCharacter;
