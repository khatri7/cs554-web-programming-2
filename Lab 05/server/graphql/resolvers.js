import { Location } from "./Location";

const resolvers = {
	Query: {
		...Location.resolvers.queries,
	},
	Mutation: {
		...Location.resolvers.mutations,
	},
};

export default resolvers;
