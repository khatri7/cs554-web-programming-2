import Axios from "axios";
import md5 from "blueimp-md5";

const axios = Axios.create({
	baseURL: "https://gateway.marvel.com/v1/public",
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
	const ts = new Date().getTime();
	const stringToHash = `${ts}${process.env.MARVEL_API_PRIVATE_KEY}${process.env.MARVEL_API_PUBLIC_KEY}`;
	const hash = md5(stringToHash);
	const requiredParams = {
		ts,
		apikey: process.env.MARVEL_API_PUBLIC_KEY,
		hash,
	};
	const { data, headers: responseHeaders } = await axios.get(endpoint, {
		params: {
			...requiredParams,
			...params,
		},
		headers,
	});
	if (withHeaders) return { data, responseHeaders };
	return data;
};

export const getCharacters = (offset = 0) =>
	GET("/characters", {
		offset,
	});

export const searchCharacters = (nameStartsWith) =>
	GET("/characters", {
		nameStartsWith,
	});

export const getCharacterById = (id) => GET(`/characters/${id}`);
