import React, { useEffect, useMemo, useState } from "react";
import { GET_TOP_TEN_LOCATIONS } from "../../utils/queries";
import { useQuery } from "@apollo/client";
import { Stack, Typography } from "@mui/material";
import LocationCard from "../../components/LocationCard";

function TopTenLocations() {
	const { loading, error, data } = useQuery(GET_TOP_TEN_LOCATIONS);
	const [locations, setLocations] = useState([]);

	useEffect(() => {
		if (data?.getTopTenClosestLocations) {
			setLocations(data.getTopTenClosestLocations);
		}
	}, [data]);

	const category = useMemo(() => {
		let totalDistance = 0;
		locations.forEach((loc) => {
			if (loc.distance && loc.distance < 8000) totalDistance += loc.distance;
		});
		if (totalDistance < 50) return "Local";
		return "Traveler";
	}, [locations]);

	if (loading) return <Typography>Loading...</Typography>;

	if (error)
		return <Typography>Error getting data: {error.message}</Typography>;

	if (locations.length === 0)
		return <Typography>No Liked Locations</Typography>;

	return (
		<Stack gap={2}>
			<Typography as="h1" variant="h4" gutterBottom>
				Top Ten Liked Locations
			</Typography>
			<Typography variant="h5" as="h2" gutterBottom>
				<span
					style={{
						fontWeight: "bold",
					}}
				>
					Category:
				</span>{" "}
				{category}
			</Typography>
			{locations.map((location) => (
				<LocationCard location={location} key={location.id} showDistance />
			))}
		</Stack>
	);
}

export default TopTenLocations;
