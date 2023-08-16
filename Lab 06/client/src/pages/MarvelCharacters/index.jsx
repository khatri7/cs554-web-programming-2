import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../../utils/queries";
import PaginationStrip from "../../components/PaginationStrip";
import {
	Box,
	Grid,
	InputAdornment,
	TextField,
	Typography,
	debounce,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CharacterCard from "../../components/CharacterCard";
import { useSelector } from "react-redux";
import { useAlertContext } from "../../contexts/Alert";

function MarvelCharacters() {
	const { pageNum: page } = useParams();
	const { errorAlert } = useAlertContext();
	const [pageNum, setPageNum] = useState(parseInt(page));
	const [searchTerm, setSearchTerm] = useState("");
	useEffect(() => {
		setPageNum(parseInt(page));
	}, [page]);
	const { data, loading, error, refetch } = useQuery(GET_CHARACTERS, {
		variables: {
			pageNum,
			searchTerm: "",
		},
	});
	const collectors = useSelector((state) => state.collectors);

	const search = React.useMemo(
		() =>
			debounce((searchTerm) => {
				refetch({ searchTerm });
			}, 300),
		[refetch]
	);

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	useEffect(() => {
		search(searchTerm.trim());
	}, [searchTerm, search]);

	const selectedItems = collectors.selected
		? collectors.value[collectors.selected]
		: [];

	if (loading) return <Typography>Loading...</Typography>;

	if (error) {
		if (
			error.graphQLErrors
				.map((gqe) => gqe.extensions.code)
				.includes("NOT_FOUND")
		) {
			errorAlert(error.message);
			return <Navigate to="/404" />;
		} else return <Typography>{error.message}</Typography>;
	}

	return (
		<div>
			<Box
				sx={{
					mb: 4,
				}}
			>
				<TextField
					placeholder="Search"
					value={searchTerm}
					onChange={handleInputChange}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<SearchOutlinedIcon />
							</InputAdornment>
						),
					}}
					label="Search"
					fullWidth
				/>
			</Box>
			{data.getAllCharacters.characters.length === 0 && (
				<Typography>No items</Typography>
			)}
			<Grid container spacing={3}>
				{data.getAllCharacters.characters.map((character) => (
					<Grid item key={character.id} xs={3}>
						<CharacterCard
							character={character}
							isSelected={selectedItems
								.map((character) => character.id)
								.includes(character.id)}
						/>
					</Grid>
				))}
			</Grid>
			{searchTerm.trim().length === 0 && (
				<PaginationStrip
					currPage={pageNum}
					totalPages={Math.ceil(data.getAllCharacters.total / 20)}
					baseUrl="/marvel-characters"
				/>
			)}
		</div>
	);
}

export default MarvelCharacters;
