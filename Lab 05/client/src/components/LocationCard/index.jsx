import React from "react";
import {
	Card,
	CardContent,
	CardMedia,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import NoImage from "../../assets/images/no-image.jpeg";
import { useMutation } from "@apollo/client";
import {
	DELETE_LOCATION,
	GET_LIKED_LOCATIONS,
	GET_TOP_TEN_LOCATIONS,
	GET_USER_POSTED_LOCATIONS,
	LIKE_MUTATION,
} from "../../utils/queries";
import { useAlertContext } from "../../contexts/Alert";

function LocationCard({ location, showDistance = false }) {
	const { errorAlert, successAlert } = useAlertContext();
	const [likeUnlikeLocation, { loading, error, reset }] = useMutation(
		LIKE_MUTATION,
		{
			refetchQueries: [
				{ query: GET_LIKED_LOCATIONS },
				{ query: GET_TOP_TEN_LOCATIONS },
			],
		}
	);
	const [
		deleteLocation,
		{ loading: delLoading, error: delError, reset: delReset },
	] = useMutation(DELETE_LOCATION, {
		refetchQueries: [
			{
				query: GET_USER_POSTED_LOCATIONS,
			},
			{ query: GET_LIKED_LOCATIONS },
			{ query: GET_TOP_TEN_LOCATIONS },
		],
	});
	const handleLikeBtn = () => {
		likeUnlikeLocation({
			variables: {
				updateLocationId: location.id,
				liked: !location.liked,
			},
		});
	};
	const handleDeleteBtn = async () => {
		await deleteLocation({
			variables: {
				deleteLocationId: location.id,
			},
		});
		successAlert("Successfully deleted location!");
	};
	if (error) {
		errorAlert(error.message);
		reset();
	}
	if (delError) {
		errorAlert(delError.message);
		delReset();
	}
	return (
		<Card raised>
			<Stack direction="row" gap={2}>
				<CardMedia
					image={location.image !== "No Image" ? location.image : NoImage}
					sx={{ height: 250, width: 250 }}
				/>
				<CardContent>
					<Stack justifyContent="space-between" sx={{ height: "100%" }}>
						<Stack gap={2}>
							<Typography variant="h5" as="h2" gutterBottom>
								{location.name}
							</Typography>
							<Stack direction="row" gap={1} alignItems="center">
								<LocationOnIcon />
								<Typography>
									{location.address || "Address unavailable"}
								</Typography>
							</Stack>
							{showDistance && (
								<Stack direction="row" gap={1} alignItems="center">
									<MyLocationIcon />
									<Typography>
										{location.distance >= 8000
											? "Distance information unavailable"
											: `${location.distance} mile${
													location.distance > 1 ? "s" : ""
											  } away`}
									</Typography>
								</Stack>
							)}
						</Stack>
						<Stack direction="row" gap={2}>
							<Tooltip title={location.liked ? "Unlike" : "Like"}>
								<IconButton onClick={handleLikeBtn} disabled={loading}>
									{location.liked ? (
										<FavoriteIcon color="error" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
							</Tooltip>
							{location.userPosted && (
								<Tooltip title="Delete" sx={{ height: "max-content" }}>
									<IconButton onClick={handleDeleteBtn} disabled={delLoading}>
										<DeleteIcon color="error" />
									</IconButton>
								</Tooltip>
							)}
						</Stack>
					</Stack>
				</CardContent>
			</Stack>
		</Card>
	);
}

export default LocationCard;
