import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_USER_POSTED_LOCATIONS } from "../../utils/queries";
import { Button, Stack, Typography } from "@mui/material";
import LocationCard from "../../components/LocationCard";
import { useNavigate } from "react-router-dom";

function MyLocations() {
	const { loading, error, data } = useQuery(GET_USER_POSTED_LOCATIONS);
	const [locations, setLocations] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (data?.userPostedLocations) {
			setLocations(data.userPostedLocations);
		}
	}, [data]);

	if (loading) return <Typography>Loading...</Typography>;

	if (error)
		return <Typography>Error getting data: {error.message}</Typography>;

	return (
		<Stack gap={2}>
			<Button
				variant="contained"
				onClick={() => {
					navigate("/new-location");
				}}
				sx={{
					alignSelf: "flex-end",
				}}
			>
				New Location
			</Button>
			<Typography as="h1" variant="h4" gutterBottom>
				My Locations
			</Typography>
			{locations.length === 0 ? (
				<Typography>No User Posted Locations</Typography>
			) : (
				locations.map((location) => (
					<LocationCard location={location} key={location.id} />
				))
			)}
		</Stack>
	);
}

export default MyLocations;
