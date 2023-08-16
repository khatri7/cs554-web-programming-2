import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	IconButton,
	Radio,
	RadioGroup,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	createCollector,
	deleteCollector,
	updateSelected,
} from "../../store/collectors";
import CharacterCard from "../../components/CharacterCard";

function Collectors() {
	const collectors = useSelector((state) => state.collectors);
	const dispatch = useDispatch();

	const [createNew, setCreateNew] = useState(false);
	const [newCollectorName, setNewCollectorName] = useState("");

	const collectorNames = useMemo(() => {
		if (!collectors) return [];
		return Object.keys(collectors.value);
	}, [collectors]);

	if (!collectors) return <Typography>Loading...</Typography>;

	const handleCancel = () => {
		setCreateNew(false);
		setNewCollectorName("");
	};

	const handleCreateNew = () => {
		dispatch(createCollector(newCollectorName.trim()));
		setCreateNew(false);
		setNewCollectorName("");
	};

	const handleDeleteCollector = (collector) => {
		dispatch(deleteCollector(collector));
	};

	return (
		<Stack gap={2}>
			{collectorNames.length === 0 ? (
				<Typography>No collectors created</Typography>
			) : (
				<FormControl>
					<FormLabel id="radio-buttons-group-label">
						<Typography variant="h3" component="h1" color="black">
							Collectors
						</Typography>
					</FormLabel>
					<RadioGroup
						aria-labelledby="radio-buttons-group-label"
						name="radio-buttons-group"
						value={collectors.selected}
						onChange={(e) => {
							dispatch(updateSelected(e.target.value));
						}}
					>
						{collectorNames.map((collector) => (
							<Stack
								direction="row"
								justifyContent="space-between"
								key={collector}
							>
								<FormControlLabel
									value={collector}
									control={<Radio />}
									label={collector}
								/>
								{collectors.selected !== collector && (
									<Tooltip title={`Delete ${collector}`}>
										<IconButton
											onClick={() => {
												handleDeleteCollector(collector);
											}}
										>
											<DeleteIcon />
										</IconButton>
									</Tooltip>
								)}
							</Stack>
						))}
					</RadioGroup>
				</FormControl>
			)}
			{createNew && (
				<Stack gap={1}>
					<TextField
						value={newCollectorName}
						placeholder="Collector Name"
						onChange={(e) => {
							setNewCollectorName(e.target.value);
						}}
						error={collectorNames.includes(
							newCollectorName.trim().toLowerCase()
						)}
						helperText={
							collectorNames.includes(newCollectorName.trim().toLowerCase())
								? "Collector with this name already exists"
								: ""
						}
					/>
					<Stack direction="row" gap={2} justifyContent="flex-end">
						<Button variant="outlined" onClick={handleCancel}>
							Cancel
						</Button>
						<Button
							variant="contained"
							onClick={handleCreateNew}
							disabled={
								newCollectorName.trim().length === 0 ||
								collectorNames.includes(newCollectorName.trim().toLowerCase())
							}
						>
							Done
						</Button>
					</Stack>
				</Stack>
			)}
			{!createNew && (
				<Button
					variant="contained"
					sx={{ alignSelf: "flex-end" }}
					onClick={() => {
						setCreateNew(true);
					}}
					startIcon={<AddIcon />}
				>
					Create New Collector
				</Button>
			)}
			{collectors.selected && (
				<Box>
					<Typography gutterBottom variant="h4" component="h1">
						Collected
					</Typography>
					{collectors.value[collectors.selected].length === 0 ? (
						<Typography>No collected characters to display</Typography>
					) : (
						<Grid container spacing={3}>
							{collectors.value[collectors.selected].map((character) => (
								<Grid item key={character.id} xs={3}>
									<CharacterCard character={character} isSelected />
								</Grid>
							))}
						</Grid>
					)}
				</Box>
			)}
		</Stack>
	);
}

export default Collectors;
