import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_LIKED_LOCATIONS } from "../../utils/queries";
import { Stack, Typography } from "@mui/material";
import LocationCard from "../../components/LocationCard";

function MyLikes() {
	const { loading, error, data } = useQuery(GET_LIKED_LOCATIONS);
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		if (data?.likedLocations) {
			setLocations(data.likedLocations);
		}
	}, [data]);

	if (loading) return <Typography>Loading...</Typography>;

	if (error)
		return <Typography>Error getting data: {error.message}</Typography>;

	if (locations.length === 0)
		return <Typography>No Liked Locations</Typography>;

	return (
		<Stack gap={2}>
			<Typography as="h1" variant="h4" gutterBottom>
				My Likes
			</Typography>
			{locations.map((location) => (
				<LocationCard location={location} key={location.id} />
			))}
		</Stack>
	);
}

export default MyLikes;
