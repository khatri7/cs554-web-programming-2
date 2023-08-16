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
import { Link, useNavigate, useParams } from "react-router-dom";
import EventCard from "../../components/EventCard";
import PaginationStrip from "../../components/PaginationStrip";
import {
	AccessTime,
	AttachMoney,
	Clear,
	LocationOn,
	SearchOutlined,
} from "@mui/icons-material";

function Events() {
	const { page } = useParams();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [keywords, setKeywords] = useState("");

	const { loading, data, error } = useFetch(
		"/events",
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
	const { events } = _embedded || {};

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
			{events?.length > 0 ? (
				<Grid container spacing={4}>
					{(events || []).map((event) => {
						let startDateStr = "";
						if (event.dates?.start?.dateTime) {
							const startDate = new Date(event.dates?.start?.dateTime);
							startDateStr = `${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()}`;
						}
						const { venues } = event._embedded;
						return (
							<Grid item xs={3} key={event.id}>
								<EventCard
									title={event.name}
									image={event.images?.length > 0 ? event.images[0].url : null}
									onClick={() => {
										navigate(`/events/${event.id}`);
									}}
								>
									<Stack gap={1}>
										{event.dates?.start?.dateTime && (
											<Stack direction="row" gap={1} alignItems="center">
												<AccessTime />
												<Typography>{startDateStr}</Typography>
											</Stack>
										)}
										{venues?.length > 0 && (
											<Stack direction="row" gap={1} alignItems="center">
												<LocationOn />
												<Typography>
													<Link
														to={`/venues/${venues[0].id}`}
														onClick={(e) => {
															e.stopPropagation();
														}}
													>
														{venues[0]?.name}
													</Link>
												</Typography>
											</Stack>
										)}
										{event.priceRanges?.length > 0 && (
											<Stack direction="row" gap={1} alignItems="center">
												<AttachMoney />
												<Typography sx={{ textTransform: "capitalize" }}>
													{event.priceRanges[0].min} -{" "}
													{event.priceRanges[0].max}
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
			{keywords.trim().length === 0 && events?.length > 0 && (
				<PaginationStrip currPage={parseInt(page)} baseUrl="/events" />
			)}
		</Box>
	);
}

export default Events;
