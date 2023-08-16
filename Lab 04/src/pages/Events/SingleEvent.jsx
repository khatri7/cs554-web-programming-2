import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Divider, Stack, Typography } from "@mui/material";
import { AccessTime, Accessible, AttachMoney } from "@mui/icons-material";

function SingleEvent() {
	const { id } = useParams();

	const { loading, data: event, error } = useFetch(`/events/${id}`);

	if (loading) return <Typography>Loading...</Typography>;

	if (error) return <Typography>{error}</Typography>;

	let startDateStr = "";
	if (event.dates?.start?.dateTime) {
		const startDate = new Date(event.dates?.start?.dateTime);
		startDateStr = `${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}`;
	}

	const { attractions, venues } = event._embedded;

	return (
		<Stack gap={2}>
			{event.images?.length > 0 && (
				<img
					src={event.images[0].url}
					alt={event.name}
					style={{
						width: "100%",
						height: "30vh",
						objectFit: "cover",
					}}
				/>
			)}
			<Typography variant="h3" component="h1">
				{event.name}
			</Typography>

			{event.accessibility?.info && (
				<>
					<Stack direction="row" gap={1} alignItems="center">
						<Accessible />
						<Typography>{event.accessibility.info}</Typography>
					</Stack>
					<Divider />
				</>
			)}
			<Typography variant="h4" component="h2">
				Classifications
			</Typography>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Genre: </Typography>
				<Typography>
					{event.classifications[0]?.genre?.name ?? "Unkown Genre"}
				</Typography>
			</Stack>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Segment: </Typography>
				<Typography>
					{event.classifications[0]?.segment?.name ?? "Unkown Segment"}
				</Typography>
			</Stack>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Sub-Genre: </Typography>
				<Typography>
					{event.classifications[0]?.subGenre?.name ?? "Unkown Sub-Genre"}
				</Typography>
			</Stack>
			<Divider />
			{event.dates?.start?.dateTime && (
				<Stack direction="row" gap={1} alignItems="center">
					<AccessTime />
					<Typography>{startDateStr}</Typography>
				</Stack>
			)}
			{event.priceRanges?.length > 0 && (
				<>
					<Stack direction="row" gap={1} alignItems="center">
						<AttachMoney />
						<Typography sx={{ textTransform: "capitalize" }}>
							{event.priceRanges[0].min} - {event.priceRanges[0].max}
						</Typography>
					</Stack>
					<Divider />
				</>
			)}
			{event.promoter && (
				<>
					<Typography variant="h4" component="h2">
						Promoter
					</Typography>
					<Typography variant="h5" component="h3">
						{event.promoter?.name ?? "Unknown Promoter"}
					</Typography>
					<Typography>{event.promoter?.description ?? ""}</Typography>
				</>
			)}
			<Divider />
			<Typography variant="h4" component="h2">
				Attractions
			</Typography>
			{attractions.map((attraction) => (
				<Typography key={attraction}>
					<Link to={`/attractions/${attraction.id}`}>{attraction.name}</Link>
				</Typography>
			))}
			<Typography variant="h4" component="h2">
				Venue
			</Typography>
			{venues.map((venue) => (
				<Typography key={venue}>
					<Link to={`/venues/${venue.id}`}>{venue.name}</Link>
				</Typography>
			))}
			<Divider />
			<Typography>
				Find out more and book your tickets on{" "}
				<Link to={event.url} target="_blank">
					Ticketmaster
				</Link>
			</Typography>
		</Stack>
	);
}

export default SingleEvent;
