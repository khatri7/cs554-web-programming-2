import { useEffect, useState } from "react";
import { GET, handleError } from "../utils/api";
import { useNavigate } from "react-router-dom";

function useFetch(endpoint, page, keyword) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [data, setData] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const makeReq = async () => {
			try {
				const params = {};
				if (keyword && typeof keyword === "string" && keyword.trim().length > 0)
					params.keyword = keyword.trim();
				else if (page) params.page = page;
				const res = await GET(endpoint, params);
				setData(res);
				setLoading(false);
				setError(false);
			} catch (e) {
				setData(null);
				setLoading(false);
				if (typeof handleError(e) === "string") setError(handleError(e));
				else setError("Unkown error occured");
				navigate("/404", {
					state: { message: error },
				});
			}
		};
		makeReq();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endpoint, page, keyword]);

	return {
		loading,
		error,
		data,
	};
}

export default useFetch;
