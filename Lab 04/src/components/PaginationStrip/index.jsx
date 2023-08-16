import { Pagination, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function PaginationStrip({ currPage, baseUrl }) {
	const navigate = useNavigate();
	return (
		<Stack my={8} alignItems="center">
			<Pagination
				count={50}
				hidePrevButton={currPage <= 1}
				hideNextButton={currPage >= 50}
				page={currPage}
				onChange={(e, newPage) => {
					navigate(`${baseUrl}/page/${newPage}`);
				}}
			/>
		</Stack>
	);
}

export default PaginationStrip;
