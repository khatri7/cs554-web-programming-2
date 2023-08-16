import { useApolloClient, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { GET_LOCATIONS } from "../../utils/queries";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import LocationCard from "../../components/LocationCard";

function Home() {
	const client = useApolloClient();
	const [page, setPage] = useState(1);
	const { loading, error, data, fetchMore } = useQuery(GET_LOCATIONS);
	const [locations, setLocations] = useState([]);
	const [fetchingMore, setFetchingMore] = useState(false);

	useEffect(
		() => () => {
			client.cache.modify({
				fields: {
					locationPosts(existing = []) {
						return existing.slice(0, 10);
					},
				},
			});
		},
		[client]
	);

	useEffect(() => {
		if (data?.locationPosts) setLocations(data.locationPosts);
	}, [data]);

	const handleLoadMore = async () => {
		setFetchingMore(true);
		await fetchMore({
			variables: {
				pageNum: page + 1,
			},
		});
		setPage((prevState) => prevState + 1);
		setFetchingMore(false);
	};

	if (loading) return <Typography>Loading...</Typography>;

	if (error)
		return <Typography>Error getting data: {error.message}</Typography>;

	return (
		<>
			<Stack gap={2}>
				<Typography as="h1" variant="h4" gutterBottom>
					Locations from the Places API
				</Typography>
				{locations.map((location) => (
					<LocationCard location={location} key={location.id} />
				))}
			</Stack>
			<Stack alignItems="center">
				<Button
					sx={{ mt: 4, minWidth: "10rem", minHeight: "2.5rem" }}
					variant="contained"
					onClick={handleLoadMore}
					disabled={fetchingMore}
				>
					{fetchingMore ? <CircularProgress size={22} /> : "Load More"}
				</Button>
			</Stack>
		</>
	);
}

export default Home;
