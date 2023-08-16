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
	Category,
	Clear,
	EventAvailable,
	SearchOutlined,
} from "@mui/icons-material";

function Attractions() {
	const { page } = useParams();
	const navigate = useNavigate();

	const [searchQuery, setSearchQuery] = useState("");
	const [keywords, setKeywords] = useState("");

	const { loading, data, error } = useFetch(
		"/attractions",
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
	const { attractions } = _embedded || {};

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
			{attractions?.length > 0 ? (
				<Grid container spacing={4}>
					{(attractions || []).map((attraction) => {
						return (
							<Grid item xs={3} key={attraction.id}>
								<EventCard
									title={attraction.name}
									image={
										attraction.images?.length > 0
											? attraction.images[0].url
											: null
									}
									onClick={() => {
										navigate(`/attractions/${attraction.id}`);
									}}
								>
									<Stack gap={1}>
										{attraction.classifications?.length > 0 && (
											<>
												<Stack direction="row" gap={1} alignItems="center">
													<Category />
													<Typography>
														{attraction.classifications[0]?.segment?.name ||
															"Unknown Category"}
													</Typography>
												</Stack>
												<Stack direction="row" gap={1} alignItems="center">
													<Typography fontWeight="bold">Genre: </Typography>
													<Typography>
														{attraction.classifications[0]?.genre?.name ||
															"Unknown Genre"}
													</Typography>
												</Stack>
											</>
										)}
										{attraction.upcomingEvents && (
											<Stack direction="row" gap={1} alignItems="center">
												<EventAvailable />
												<Typography>
													{attraction.upcomingEvents?._total} upcoming events
												</Typography>
											</Stack>
										)}
										{attraction.priceRanges?.length > 0 && (
											<Stack
												direction="row"
												gap={1}
												alignItems="center"
											></Stack>
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
			{keywords.trim().length === 0 && attractions?.length > 0 && (
				<PaginationStrip currPage={parseInt(page)} baseUrl="/attractions" />
			)}
		</Box>
	);
}

export default Attractions;
