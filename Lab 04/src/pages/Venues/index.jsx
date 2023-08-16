import {
	Box,
	Button,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import EventCard from "../../components/EventCard";
import PaginationStrip from "../../components/PaginationStrip";
import {
	Clear,
	EventAvailable,
	LocationOn,
	SearchOutlined,
} from "@mui/icons-material";

function Venues() {
	const { page } = useParams();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [keywords, setKeywords] = useState("");

	const { loading, data, error } = useFetch(
		"/venues",
		parseInt(page) - 1,
		keywords
	);

	useEffect(() => {
		if (searchQuery.trim().length === 0) setKeywords("");
	}, [searchQuery]);

	const handleSearch = () => {
		setKeywords(searchQuery);
	};

	const handleClear = () => {
		setSearchQuery("");
	};

	if (loading) return <Typography>Loading...</Typography>;

	if (error) return <Typography>{error}</Typography>;

	const { _embedded } = data;
	const { venues } = _embedded || {};

	return (
		<Box>
			<Stack direction="row" gap={2} mb={4}>
				<FormControl fullWidth>
					<TextField
						fullWidth
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchOutlined />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									{searchQuery.trim().length > 0 && (
										<IconButton onClick={handleClear}>
											<Clear />
										</IconButton>
									)}
								</InputAdornment>
							),
						}}
						name="keywords"
						label="Keywords"
					/>
				</FormControl>
				<Button
					type="submit"
					variant="contained"
					sx={{ px: 4 }}
					onClick={handleSearch}
					disabled={searchQuery.trim() === ""}
				>
					Search
				</Button>
			</Stack>
			{venues?.length > 0 ? (
				<Grid container spacing={4}>
					{(venues || []).map((venue) => {
						const { address, city } = venue;
						return (
							<Grid item xs={3} key={venue.id}>
								<EventCard
									title={venue.name}
									image={venue.images?.length > 0 ? venue.images[0].url : null}
									onClick={() => {
										navigate(`/venues/${venue.id}`);
									}}
								>
									<Stack gap={1}>
										<Stack direction="row" gap={1} alignItems="flex-start">
											<LocationOn />
											<Stack>
												{address.line1 && (
													<Typography>{address.line1}</Typography>
												)}
												{city.name && <Typography>{city.name}</Typography>}
											</Stack>
										</Stack>
										{venue.upcomingEvents && (
											<Stack direction="row" gap={1} alignItems="flex-start">
												<EventAvailable />
												<Typography>
													{venue.upcomingEvents._total} upcoming events
												</Typography>
											</Stack>
										)}
									</Stack>
								</EventCard>
							</Grid>
						);
					})}
				</Grid>
			) : (
				<Typography>No Data</Typography>
			)}
			{keywords.trim().length === 0 && venues?.length > 0 && (
				<PaginationStrip currPage={parseInt(page)} baseUrl="/venues" />
			)}
		</Box>
	);
}

export default Venues;
