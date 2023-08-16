import Axios from "axios";

const axios = Axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	params: {
		apikey: process.env.REACT_APP_API_KEY,
		countryCode: "US",
	},
});

export const handleError = (error) => {
	if (error.response?.data?.message) return error.response.data.message;
	if (error.message) return error.message;
	return error;
};

export const GET = async (endpoint, params = {}, headers = {}) => {
	const { data } = await axios.get(endpoint, { params, headers });
	return data;
};
