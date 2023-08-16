import {
	getCharacterById,
	getCharacters,
	searchCharacters,
} from "../../utils/api";
import { badRequestError, notFoundError } from "../../utils/helpers";

export const getAllCharacters = async (_, { pageNum = 1, searchTerm }) => {
	if (pageNum < 1) throw badRequestError("Invalid page number");
	/** @type {import("../../utils/types/character").CharactersResponse} */
	let response;
	if (searchTerm && searchTerm.trim().length > 0)
		response = await searchCharacters(searchTerm);
	else response = await getCharacters((pageNum - 1) * 20);
	const characters = response.data.results;
	if (Math.ceil(response.data.total / 20) < pageNum)
		throw notFoundError("No results found for the page provided");
	return {
		count: response.data.count,
		total: response.data.total,
		characters: characters.map((character) => ({
			id: character.id,
			name: character.name,
			image: character.thumbnail
				? character.thumbnail.path + "." + character.thumbnail.extension
				: "No Image",
			description: character.description,
			comics: character.comics?.items?.map((comic) => comic.name) ?? [],
		})),
	};
};

const isNumberChar = (char) => char >= "0" && char <= "9";

export const getCharacterByCharacterId = async (_, { id }) => {
	if (!id) throw badRequestError("Invalid id");
	id.split("").forEach((char) => {
		if (!isNumberChar(char)) throw badRequestError("Invalid Id");
	});
	/** @type {import("../../utils/types/character").CharactersResponse} */
	let response;
	try {
		response = await getCharacterById(id);
	} catch (e) {
		throw notFoundError("No character found with given id");
	}
	if (response.data?.results.length === 0)
		throw notFoundError("No character found with given id");
	const character = response.data.results[0];
	return {
		id: character.id,
		name: character.name,
		image: character.thumbnail
			? character.thumbnail.path + "." + character.thumbnail.extension
			: "No Image",
		description: character.description,
		comics: character.comics?.items?.map((comic) => comic.name) ?? [],
	};
};
