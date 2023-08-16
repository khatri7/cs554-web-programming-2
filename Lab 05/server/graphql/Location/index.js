import {
	locationPosts,
	likedLocations,
	userPostedLocations,
	uploadLocation,
	updateLocation,
	deleteLocation,
	updateUserLocation,
	getTopTenClosestLocations,
} from "../../data/location";

const types = `
    type Location {
        id: ID!
        image: String!
        name: String!
        address: String
        userPosted: Boolean!
        liked: Boolean!
		distance: Int!
    }
`;

const queries = `
    locationPosts(pageNum: Int): [Location]
    likedLocations: [Location]
    userPostedLocations: [Location]
	getTopTenClosestLocations: [Location]
`;

const mutations = `
    uploadLocation(image: String!, address: String, name: String!): Location
    updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean): Location
    deleteLocation(id: ID!): Location
	updateUserLocation(latitude: Float!, longitude: Float!): Boolean
`;

const resolvers = {
	queries: {
		locationPosts,
		likedLocations,
		userPostedLocations,
		getTopTenClosestLocations,
	},
	mutations: {
		uploadLocation,
		updateLocation,
		deleteLocation,
		updateUserLocation,
	},
};

export const Location = {
	queries,
	mutations,
	resolvers,
	types,
};
