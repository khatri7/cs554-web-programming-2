import Axios from "axios";

const axios = Axios.create({
	baseURL: "https://api.foursquare.com/v3/places",
	headers: {
		Authorization: process.env.FOURSQUARE_API_KEY,
	},
});

export const handleError = (error) => {
	if (error.response?.data?.message) return error.response.data.message;
	if (error.message) return error.message;
	return error;
};

export const GET = async (
	endpoint,
	params = {},
	headers = {},
	withHeaders = false
) => {
	const { data, headers: responseHeaders } = await axios.get(endpoint, {
		params,
		headers,
	});
	if (withHeaders) return { data, responseHeaders };
	return data;
};

export const getLocations = (cursor) => GET("/search", { cursor }, {}, true);

export const getLocationById = (id) => GET(`/${id}`);

export const getLocationImages = (fsqId) => GET(`/${fsqId}/photos`);
