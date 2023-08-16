import { Pagination, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function PaginationStrip({ currPage, baseUrl, totalPages }) {
	const navigate = useNavigate();
	return (
		<Stack my={8} alignItems="center">
			<Pagination
				count={totalPages}
				hidePrevButton={currPage <= 1}
				hideNextButton={currPage >= totalPages}
				page={currPage}
				onChange={(e, newPage) => {
					navigate(`${baseUrl}/page/${newPage}`);
				}}
			/>
		</Stack>
	);
}

export default PaginationStrip;
