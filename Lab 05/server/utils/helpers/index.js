import { parse } from "uuid";
import { GraphQLError } from "graphql";

const rImage =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/g;

export const badRequestError = (message) =>
	new GraphQLError(message || "Bad Request", {
		extensions: {
			code: "BAD_REQUEST",
		},
	});

export const notFoundError = (message) =>
	new GraphQLError(message || "Not Found", {
		extensions: {
			code: "NOT_FOUND",
		},
	});

/**
 *
 * @param {string} str
 * @param {string} varName
 * @param {("min" | "max" | "equal")} [compareOp]
 * @param {number} [compareVal]
 * @returns str after trimming if it is a valid string input
 */
export const isValidStr = (str, varName, compareOp, compareVal) => {
	if (!str) throw badRequestError(`You need to provide a ${varName}`);
	if (typeof str !== "string")
		throw badRequestError(`${varName} should be of type string`);
	str = str.trim();
	if (str.length === 0)
		throw badRequestError(
			`Empty string/string with spaces is not a valid ${varName}`
		);
	if (compareOp && compareVal) {
		switch (compareOp) {
			case "min":
				if (str.length < compareVal)
					throw badRequestError(
						`${varName} should be at least ${compareVal} in length`
					);
				break;
			case "max":
				if (str.length > compareVal)
					throw badRequestError(
						`${varName} should be at max ${compareVal} in length`
					);
				break;
			case "equal":
				if (str.length !== compareVal)
					throw badRequestError(`${varName} should be ${compareVal} in length`);
				break;
			default:
				break;
		}
	}
	return str;
};

export const isBoolean = (param) => {
	return typeof param === "boolean";
};

export const isValidUiud = (id) => {
	try {
		parse(id);
		return true;
	} catch (e) {
		return false;
	}
};

export const getQueryParameters = (url) => {
	const query = {};
	try {
		isValidStr(url, "URL");
	} catch {
		return query;
	}
	const start = url.indexOf("?") + 1;
	if (start <= 0) return query;
	let end = url.indexOf("#");
	if (end < 0) end = url.length;
	const queryString = url.substr(start, end);
	const queryArr = queryString.split("&").map((item) => item.split("="));
	queryArr.forEach(([key, val]) => {
		query[key.trim()] = val?.trim() ?? "";
	});
	return query;
};

export const isValidImageUrl = (url) => {
	url = isValidStr(url, "Image URL");
	const validUrl = rImage.test(url);
	if (!validUrl) throw badRequestError("Invalid Image Url");
	return url;
};
