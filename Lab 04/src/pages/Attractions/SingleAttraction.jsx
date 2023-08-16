import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { Divider, Stack, Typography } from "@mui/material";
import { EventAvailable } from "@mui/icons-material";

function SingleAttraction() {
	const { id } = useParams();

	const { loading, data: attraction, error } = useFetch(`/attractions/${id}`);

	if (loading) return <Typography>Loading...</Typography>;

	if (error) return <Typography>{error}</Typography>;

	return (
		<Stack gap={2}>
			{attraction.images?.length > 0 && (
				<img
					src={attraction.images[0].url}
					alt={attraction.name}
					style={{
						width: "100%",
						height: "30vh",
						objectFit: "cover",
					}}
				/>
			)}
			<Typography variant="h3" component="h1">
				{attraction.name}
			</Typography>
			{attraction.upcomingEvents && (
				<Stack direction="row" gap={1} alignItems="center">
					<EventAvailable />
					<Typography>
						{attraction.upcomingEvents?._total} upcoming events
					</Typography>
				</Stack>
			)}
			<Typography variant="h4" component="h2">
				Classifications
			</Typography>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Genre: </Typography>
				<Typography>
					{attraction.classifications[0]?.genre?.name ?? "Unkown Genre"}
				</Typography>
			</Stack>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Segment: </Typography>
				<Typography>
					{attraction.classifications[0]?.segment?.name ?? "Unkown Segment"}
				</Typography>
			</Stack>
			<Stack direction="row" gap={1} alignItems="center">
				<Typography fontWeight="bold">Sub-Genre: </Typography>
				<Typography>
					{attraction.classifications[0]?.subGenre?.name ?? "Unkown Sub-Genre"}
				</Typography>
			</Stack>
			<Divider />
			<Typography variant="h4" component="h2">
				External Links
			</Typography>
			{attraction.externalLinks &&
				Object.entries(attraction.externalLinks).map(([key, value]) => (
					<Stack key={key} direction="row" gap={1} alignItems="center">
						<Typography sx={{ textTransform: "capitalize" }}>
							<Link to={value[0].url} target="_blank">
								{key}
							</Link>
						</Typography>
					</Stack>
				))}
			<Divider />
			<Typography>
				Find out more and book your tickets on{" "}
				<Link to={attraction.url} target="_blank">
					Ticketmaster
				</Link>
			</Typography>
		</Stack>
	);
}

export default SingleAttraction;
