import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import {
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Stack,
	Typography,
} from "@mui/material";

import "../App.css";

const isValidPageNum = (pageStr) => {
	for (let char of pageStr) {
		if (char < "0" || char > "9") return false;
	}
	return true;
};

const ShowList = () => {
	const regex = /(<([^>]+)>)/gi;

	const { pageNum } = useParams();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [searchData, setSearchData] = useState([]);
	const [showsData, setShowsData] = useState([]);
	const [nextPageData, setNextPageData] = useState(undefined);
	const [page, setPage] = useState(undefined);
	const [nextPage, setNextPage] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState("");
	let card = null;

	useEffect(() => {
		if (pageNum) {
			if (isValidPageNum(pageNum)) setPage(parseInt(pageNum));
			else {
				setLoading(false);
				setError("ERROR: Invalid Page Number");
			}
		} else setPage(0);
	}, [pageNum]);

	useEffect(() => {
		async function fetchData() {
			if (nextPageData && nextPage === page) setShowsData(nextPageData);
			else {
				try {
					const { data } = await axios.get(
						`http://api.tvmaze.com/shows?page=${page}`
					);
					setShowsData(data);
				} catch (e) {
					console.error(e);
					if (e.response.status === 404) {
						setError("404 - TV Shows list not found");
					} else setError("Unexpected Error");
				}
			}
			try {
				const { data } = await axios.get(
					`http://api.tvmaze.com/shows?page=${page + 1}`
				);
				setNextPage(page + 1);
				setNextPageData(data);
			} catch (e) {
				setNextPageData(null);
			} finally {
				setLoading(false);
				setError(false);
			}
		}
		if (page !== undefined) {
			fetchData();
		}
	}, [page]);

	useEffect(() => {
		async function fetchSearchData() {
			try {
				const { data } = await axios.get(
					"http://api.tvmaze.com/search/shows?q=" + searchTerm
				);
				setSearchData(data);
				setLoading(false);
			} catch (e) {
				console.error(e);
			}
		}
		if (searchTerm) {
			fetchSearchData();
		}
	}, [searchTerm]);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};

	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={show.id}>
				<Card
					variant="outlined"
					sx={{
						maxWidth: 250,
						height: "auto",
						marginLeft: "auto",
						marginRight: "auto",
						borderRadius: 5,
						border: "1px solid #1e8678",
						boxShadow:
							"0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
					}}
				>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								sx={{
									height: "100%",
									width: "100%",
								}}
								component="img"
								image={
									show.image && show.image.original
										? show.image.original
										: noImage
								}
								title="show image"
							/>

							<CardContent>
								<Typography
									sx={{
										borderBottom: "1px solid #1e8678",
										fontWeight: "bold",
									}}
									gutterBottom
									variant="h6"
									component="h3"
								>
									{show.name}
								</Typography>
								<Typography variant="body2" color="textSecondary" component="p">
									{show.summary
										? show.summary.replace(regex, "").substring(0, 139) + "..."
										: "No Summary"}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		if (showsData?.length === 0)
			card = (
				<Grid item xs={12}>
					<Typography align="center">No Shows</Typography>
				</Grid>
			);
		else
			card =
				showsData &&
				showsData.map((show) => {
					return buildCard(show);
				});
	}

	if (loading)
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);

	if (error)
		return (
			<>
				<Typography>{error}</Typography>
				<Button
					variant="outlined"
					onClick={() => navigate("/shows/page/0")}
					sx={{ mt: 2 }}
				>
					Go to first page
				</Button>
			</>
		);

	return (
		<div>
			<SearchShows searchValue={searchValue} />
			<br />
			<br />
			{!searchTerm && (
				<Stack
					direction="horizontal"
					gap={2}
					alignItems="center"
					justifyContent="center"
					marginBottom={4}
				>
					{page > 0 && (
						<Button
							onClick={() => {
								navigate(`/shows/page/${page - 1}`);
							}}
							variant="contained"
						>
							Previous
						</Button>
					)}
					<Typography>{page}</Typography>
					{nextPageData && (
						<Button
							onClick={() => {
								navigate(`/shows/page/${page + 1}`);
							}}
							variant="contained"
						>
							Next
						</Button>
					)}
				</Stack>
			)}
			<Grid
				container
				spacing={2}
				sx={{
					flexGrow: 1,
					flexDirection: "row",
				}}
			>
				{card}
			</Grid>
		</div>
	);
};

export default ShowList;
