import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Divider, Stack, Typography } from "@mui/material";
import { Accessible, EventAvailable, LocationOn } from "@mui/icons-material";

function SingleVenue() {
	const { id } = useParams();

	const { loading, data: venue, error } = useFetch(`/venues/${id}`);

	if (loading) return <Typography>Loading...</Typography>;

	if (error) return <Typography>{error}</Typography>;

	return (
		<Stack gap={2}>
			{venue.images?.length > 0 && (
				<img
					src={venue.images[0].url}
					alt={venue.name}
					style={{
						width: "100%",
						height: "30vh",
						objectFit: "cover",
					}}
				/>
			)}
			<Typography variant="h3" component="h1">
				{venue.name}
			</Typography>
			<Stack direction="row" gap={1} alignItems="flex-start">
				<LocationOn />
				<Stack>
					{venue.address.line1 && (
						<Typography>{venue.address.line1}</Typography>
					)}
					{venue.city.name && <Typography>{venue.city.name}</Typography>}
				</Stack>
			</Stack>
			{venue.upcomingEvents && (
				<Stack direction="row" gap={1} alignItems="flex-start">
					<EventAvailable />
					<Typography>{venue.upcomingEvents._total} upcoming events</Typography>
				</Stack>
			)}
			<Divider />
			{venue.accessibleSeatingDetail && (
				<Stack direction="row" gap={1} alignItems="flex-start">
					<Accessible />
					<Stack>{venue.accessibleSeatingDetail}</Stack>
				</Stack>
			)}
			<Divider />
			<Typography variant="h4" component="h2">
				General Information
			</Typography>
			<Typography fontWeight="bold" component="h3" variant="h5">
				Child Rule
			</Typography>
			<Typography>
				{venue.generalInfo?.childRule ?? "No information available"}
			</Typography>
			<Typography fontWeight="bold" component="h3" variant="h5">
				General Rule
			</Typography>
			<Typography>
				{venue.generalInfo?.generalRule ?? "No information available"}
			</Typography>

			<Divider />
			<Typography>
				Find out more and book your tickets on{" "}
				<Link to={venue.url} target="_blank">
					Ticketmaster
				</Link>
			</Typography>
		</Stack>
	);
}

export default SingleVenue;
