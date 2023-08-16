import { Character } from "./Character";

const resolvers = {
	Query: {
		...Character.resolvers.queries,
	},
};

export default resolvers;
