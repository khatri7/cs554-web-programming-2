import { gql } from "@apollo/client";

/**
 * Queries
 */

export const GET_CHARACTERS = gql`
	query GetAllCharacters($pageNum: Int, $searchTerm: String) {
		getAllCharacters(pageNum: $pageNum, searchTerm: $searchTerm) {
			count
			total
			characters {
				id
				image
				name
				description
			}
		}
	}
`;

export const GET_CHARACTER_BY_ID = gql`
	query GetCharacterByCharacterId($characterId: ID!) {
		getCharacterByCharacterId(id: $characterId) {
			id
			image
			name
			description
			comics
		}
	}
`;
