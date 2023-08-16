import { gql } from "@apollo/client";

/**
 * Queries
 */

export const GET_LOCATIONS = gql`
	query LocationPosts($pageNum: Int) {
		locationPosts(pageNum: $pageNum) {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const GET_LIKED_LOCATIONS = gql`
	query LikedLocations {
		likedLocations {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const GET_USER_POSTED_LOCATIONS = gql`
	query UserPostedLocations {
		userPostedLocations {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const GET_TOP_TEN_LOCATIONS = gql`
	query GetTopTenClosestLocations {
		getTopTenClosestLocations {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

/**
 * Mutations
 */

export const LIKE_MUTATION = gql`
	mutation Mutation($updateLocationId: ID!, $liked: Boolean) {
		updateLocation(id: $updateLocationId, liked: $liked) {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const UPLOAD_LOCATION = gql`
	mutation UploadLocation($image: String!, $address: String, $name: String!) {
		uploadLocation(image: $image, address: $address, name: $name) {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const DELETE_LOCATION = gql`
	mutation DeleteLocation($deleteLocationId: ID!) {
		deleteLocation(id: $deleteLocationId) {
			id
			image
			name
			address
			userPosted
			liked
			distance
		}
	}
`;

export const SET_USER_LOCATION = gql`
	mutation UpdateUserLocation($latitude: Float!, $longitude: Float!) {
		updateUserLocation(latitude: $latitude, longitude: $longitude)
	}
`;
