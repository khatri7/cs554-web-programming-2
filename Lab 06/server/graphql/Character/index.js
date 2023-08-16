import {
	getAllCharacters,
	getCharacterByCharacterId,
} from "../../data/character";

const types = `
    type Character {
        id: ID!
        image: String!
        name: String!
		description: String!
		comics: [String]!
    }

	type AllCharacters { 
		count: Int!
		total: Int!
		characters: [Character]!
	}
`;

const queries = `
    getAllCharacters(pageNum: Int, searchTerm: String): AllCharacters
	getCharacterByCharacterId(id: ID!): Character
`;

const mutations = "";

const resolvers = {
	queries: {
		getAllCharacters,
		getCharacterByCharacterId,
	},
	mutations: {},
};

export const Character = {
	queries,
	mutations,
	resolvers,
	types,
};
