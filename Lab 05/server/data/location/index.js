import {
	getLocationById,
	getLocationImages,
	getLocations,
} from "../../utils/api";
import redis from "redis";
import { v4 as uuidv4 } from "uuid";
import { getDistance, convertDistance, isValidCoordinate } from "geolib";
import {
	badRequestError,
	getQueryParameters,
	isBoolean,
	isValidImageUrl,
	isValidStr,
	isValidUiud,
	notFoundError,
} from "../../utils/helpers";

const client = redis.createClient();
client.connect().then(() => {});
client.on("error", (err) => console.log("Redis Client Error", err));

const cursors = {
	1: "",
};

const USER_COORDINATES = {
	latitude: undefined,
	longitude: undefined,
};

export const likedLocations = async () => {
	return (await client.get("20012198_likedLocations")?.then(JSON.parse)) || [];
};

export const userPostedLocations = async () => {
	return (await client.get("20012198_postedLocations")?.then(JSON.parse)) || [];
};

export const locationPosts = async (_, { pageNum = 1 }) => {
	if (typeof pageNum !== "number" || Number.isNaN(pageNum))
		throw badRequestError("Invalid page number");
	if (pageNum !== 1 && !cursors[pageNum])
		throw notFoundError("Page number not found");
	const { data, responseHeaders } = await getLocations(
		cursors[pageNum || 1] || ""
	);
	const { link } = responseHeaders;
	if (link && typeof link === "string") {
		const trimmedLink = link.substring(1, link.indexOf(">"));
		const { cursor } = getQueryParameters(trimmedLink);
		if (cursor) {
			let page = pageNum || 1;
			cursors[page + 1] = cursor;
		}
	}
	/** @type {{results: import("../../utils/types/locations").LocationObj[]}} */
	const { results: locations } = data;
	const likedLocationsFromRedis = await likedLocations();
	const likedLocationIds = likedLocationsFromRedis.map((l) => l.id);
	return await Promise.all(
		locations.map(async (loc) => {
			let image = "No Image";
			try {
				const images = await getLocationImages(loc.fsq_id);
				if (Array.isArray(images) && images.length > 1)
					image = `${images[0].prefix}original${images[0].suffix}`;
			} catch (e) {
				console.log(e);
			}
			let distance = 8000;
			if (USER_COORDINATES.latitude && USER_COORDINATES.longitude) {
				distance = getDistance(USER_COORDINATES, loc.geocodes.main);
				distance = Math.round(convertDistance(distance, "mi"));
			}
			return {
				id: loc.fsq_id,
				image,
				name: loc.name,
				address: loc.location.formatted_address,
				userPosted: false,
				liked: likedLocationIds.includes(loc.fsq_id),
				distance,
			};
		})
	);
};

const getLocationPostById = async (id) => {
	isValidStr(id, "Id");
	/** @type {import("../../utils/types/locations").LocationObj} */
	const location = await getLocationById(id);
	const locationImages = await getLocationImages(id);
	let image = "No Image";
	if (Array.isArray(locationImages) && locationImages.length > 1)
		image = `${locationImages[0].prefix}original${locationImages[0].suffix}`;
	let distance = 8000;
	if (USER_COORDINATES.latitude && USER_COORDINATES.longitude) {
		distance = getDistance(USER_COORDINATES, location.geocodes.main);
		distance = Math.round(convertDistance(distance, "mi"));
	}
	return {
		id: location.fsq_id,
		image,
		name: location.name,
		address: location.location.formatted_address,
		userPosted: false,
		liked: false,
		distance,
	};
};

const getUserPostedLocation = async (id) => {
	isValidStr(id, "Id");
	if (!isValidUiud(id))
		throw badRequestError(
			"Invalid Id, must be of type UUID for a user posted location"
		);
	const allUserPostedLocations = await userPostedLocations();
	const location = allUserPostedLocations.find((loc) => loc.id === id);
	if (!location) {
		try {
			// should fail since there is a uuid check before this
			await getLocationPostById(id);
		} catch (e) {
			throw notFoundError("No location found with given id");
		}
		throw badRequestError(
			"You cannot modify/delete a location that is not user posted"
		);
	}
	return location;
};

export const uploadLocation = async (_, { image, address, name }) => {
	name = isValidStr(name, "Name");
	let checkedAddress = null;
	if (address) {
		checkedAddress = isValidStr(address, "Address");
	}
	image = isValidImageUrl(image);
	const location = {
		id: uuidv4(),
		image,
		address: checkedAddress,
		name,
		userPosted: true,
		liked: false,
		distance: 8000,
	};
	const allUserPostedLocations = await userPostedLocations();
	const updatedUserPostedLocations = [...allUserPostedLocations, location];
	await client.set(
		"20012198_postedLocations",
		JSON.stringify(updatedUserPostedLocations)
	);
	return location;
};

const getLocationByIdFromAll = async (id) => {
	let location;
	try {
		if (!isValidUiud(id)) {
			location = await getLocationPostById(id);
		} else {
			location = await getUserPostedLocation(id);
		}
	} catch {
		throw notFoundError("No location found with given id");
	}
	return location;
};

export const updateLocation = async (
	_,
	{ id, image, name, address, userPosted, liked }
) => {
	if (
		!image &&
		!name &&
		!address &&
		!isBoolean(userPosted) &&
		!isBoolean(liked)
	)
		throw badRequestError("No parameters provided");
	let location;
	// it has to be a user posted location if these fields are being updated
	if (image || name || address) {
		location = await getUserPostedLocation(id);
		if (image && isValidImageUrl(image)) location.image = image.trim();
		if (name && isValidStr(name, "Name")) location.name = name.trim();
		if (address && isValidStr(address, "Address"))
			location.address = address.trim();
	} else {
		location = await getLocationByIdFromAll(id);
	}
	if (isBoolean(liked)) {
		const allLikedLocations = await likedLocations();
		const locationFromLikedLocations = allLikedLocations.find(
			(location) => location.id === id
		);
		if (!liked && !locationFromLikedLocations)
			throw badRequestError("Cannot unlike a location which hasn't been liked");
		if (liked && locationFromLikedLocations)
			throw badRequestError(
				"Cannot like a location which has already been liked"
			);
		location.liked = liked;

		let updatedLikedLocations;
		if (!liked) {
			updatedLikedLocations = allLikedLocations.filter(
				(location) => location.id !== id
			);
			await client.zRem("20012198_topTenClosest", location.id);
		} else {
			updatedLikedLocations = [...allLikedLocations, location];
			await client.zAdd("20012198_topTenClosest", {
				score: location.distance,
				value: location.id,
			});
		}
		await client.set(
			"20012198_likedLocations",
			JSON.stringify(updatedLikedLocations)
		);
	}
	if (location.userPosted) {
		const allUserPostedLocations = await userPostedLocations();
		const updatedUserPostedLocations = allUserPostedLocations.map((loc) => {
			if (loc.id === location.id) return location;
			return loc;
		});
		await client.set(
			"20012198_postedLocations",
			JSON.stringify(updatedUserPostedLocations)
		);
	}
	return location;
};

export const deleteLocation = async (_, { id }) => {
	const location = await getUserPostedLocation(id);
	const allUserPostedLocations = await userPostedLocations();
	const updatedUserPostedLocations = allUserPostedLocations.filter(
		(loc) => loc.id !== id
	);
	const allLikedLocations = await likedLocations();
	const updatedLikedLocations = allLikedLocations.filter(
		(loc) => loc.id !== id
	);
	await client.set(
		"20012198_postedLocations",
		JSON.stringify(updatedUserPostedLocations)
	);
	await client.set(
		"20012198_likedLocations",
		JSON.stringify(updatedLikedLocations)
	);
	return location;
};

export const updateUserLocation = async (_, { latitude, longitude }) => {
	if (isValidCoordinate({ latitude, longitude })) {
		USER_COORDINATES.latitude = latitude;
		USER_COORDINATES.longitude = longitude;
		const allLikedLocations = await likedLocations();
		let updateLiked = false;
		const updatedLikedLocations = await Promise.all(
			allLikedLocations.map(async (loc) => {
				if (!loc.userPosted && loc.distance >= 8000) {
					updateLiked = true;
					const updatedLocation = await getLocationPostById(loc.id);
					await client.zAdd("20012198_topTenClosest", {
						score: updatedLocation.distance,
						value: updatedLocation.id,
					});
					return { ...updatedLocation, liked: true };
				}
				return loc;
			})
		);
		if (updateLiked)
			await client.set(
				"20012198_likedLocations",
				JSON.stringify(updatedLikedLocations)
			);
		return true;
	}
	return false;
};

export const getTopTenClosestLocations = async () => {
	const locationIds = await client.zRange("20012198_topTenClosest", 0, 9);
	const allLikedLocations = await likedLocations();
	const locations = locationIds
		.map((id) => allLikedLocations.find((loc) => loc.id === id))
		.filter((loc) => loc !== undefined);
	return locations;
};
