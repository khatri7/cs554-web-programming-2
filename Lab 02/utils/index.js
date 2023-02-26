const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

const cookingSkills = ["novice", "intermediate", "advanced"];

// error codes and messages
const error = {
	BAD_REQUEST: {
		status: 400,
		message: "Invalid Request Parameter",
	},
	UNAUTHORIZED: {
		status: 401,
		message: "Invalid or no JWT provided",
	},
	FORBIDDEN: {
		status: 403,
		message: "You are not authorized to perform this action",
	},
	NOT_FOUND: {
		status: 404,
		message: "Not Found",
	},
	INTERNAL_SERVER_ERROR: {
		status: 500,
		message: "Internal Server Error",
	},
};

Object.freeze(error);

const createErrorObj = (err, message) => {
	if (!err || !err.status || !err.message) return error.INTERNAL_SERVER_ERROR;
	return {
		...err,
		message: message ? message : err.message,
	};
};

const badRequestErr = (message) => createErrorObj(error.BAD_REQUEST, message);
const notFoundErr = (message) => createErrorObj(error.NOT_FOUND, message);
const internalServerErr = (message) =>
	createErrorObj(error.INTERNAL_SERVER_ERROR, message);
const unauthorizedErrorObj = (message) =>
	createErrorObj(error.UNAUTHORIZED, message);
const forbiddenErrorObj = (message) => createErrorObj(error.FORBIDDEN, message);

const sendErrResp = (res, { status, message }) =>
	res
		.status(status || error.INTERNAL_SERVER_ERROR.status)
		.json(message ? { message } : "");

/**
 *
 * @param {string} char
 * @returns {boolean} if the character provided is a lower case letter
 */
const isLetterChar = (char) =>
	char.toLowerCase() >= "a" && char.toLowerCase() <= "z";

/**
 *
 * @param {string} char
 * @returns {boolean} if the character provided is a number
 */
const isNumberChar = (char) => char >= "0" && char <= "9";

/**
 *
 * @param {string} str
 * @param {string} varName
 * @param {("min" | "max" | "equal")} compareOp
 * @param {number} compareVal
 * @returns str after trimming if it is a valid string input
 */
const isValidStr = (str, varName, compareOp, compareVal) => {
	if (!str) throw badRequestErr(`You need to provide a ${varName}`);
	if (typeof str !== "string")
		throw badRequestErr(`${varName} should be of type string`);
	str = str.trim();
	if (str.length === 0)
		throw badRequestErr(
			`Empty string/string with spaces is not a valid ${varName}`
		);
	if (compareOp && compareVal) {
		switch (compareOp) {
			case "min":
				if (str.length < compareVal)
					throw badRequestErr(
						`${varName} should be at least ${compareVal} in length`
					);
				break;
			case "max":
				if (str.length > compareVal)
					throw badRequestErr(
						`${varName} should be at max ${compareVal} in length`
					);
				break;
			case "equal":
				if (str.length !== compareVal)
					throw badRequestErr(`${varName} should be ${compareVal} in length`);
				break;
			default:
				break;
		}
	}
	return str;
};

/**
 *
 * @param {Array} arr
 * @param {string} arrName
 * @param {("min" | "max" | "equal")} compareOp
 * @param {number} compareVal
 */
const isValidArray = (arr, arrName, compareOp, compareVal) => {
	if (!arr) throw badRequestErr(`You need to provide ${arrName}`);
	if (typeof arr !== "object" || !Array.isArray(arr))
		throw badRequestErr(`${arrName} should be of type array`);
	if (compareOp && compareVal) {
		switch (compareOp) {
			case "min":
				if (arr.length < compareVal)
					throw badRequestErr(
						`${arrName} length should be at least ${compareVal}`
					);
				break;
			case "max":
				if (arr.length > compareVal)
					throw badRequestErr(`${arrName} length cannot be more ${compareVal}`);
				break;
			case "equal":
				if (arr.length !== compareVal)
					throw badRequestErr(`${arrName} length should be ${compareVal}`);
				break;
			default:
				break;
		}
	}
};

/**
 *
 * @param {object} obj
 * @returns {boolean} true if the object provided is a valid object
 */
const isValidObj = (obj) =>
	obj !== null && typeof obj === "object" && !Array.isArray(obj);

/**
 *
 * @param {string} id
 * @returns {ObjectId} the object id if it is valid otherwise throws an error
 */
const isValidObjectId = (id) => {
	id = isValidStr(id, "Id");
	if (!ObjectId.isValid(id)) throw badRequestErr("Invalid Object Id");
	return ObjectId(id);
};

/**
 *
 * @param {string} name
 * @param {string} varName
 * @param {boolean} allowPunctuations
 * @returns {string} name after trimming if it is a valid director name otherwise throws an error
 */
const isValidName = (name, varName, allowPunctuations = false) => {
	name = isValidStr(name, varName);
	const split = ([firstName, lastName, ...rest] = name.split(" "));
	if (split.length != 2)
		throw badRequestErr(
			`Invalid ${varName} name. Must be of format {First Name} {Last Name}`
		);
	const cleanName = `${isValidStr(
		firstName,
		`${varName} First Name`,
		"min",
		2
	)} ${isValidStr(lastName, `${varName} Last Name`, "min", 2)}`;
	isValidStr(firstName, `${varName} First Name`, "max", 20);
	isValidStr(lastName, `${varName} Last Name`, "max", 20);
	cleanName
		.toLowerCase()
		.split("")
		.forEach((char) => {
			if (
				!isLetterChar(char) &&
				char !== " " &&
				!(allowPunctuations && ["'", ".", "-"].includes(char))
			)
				throw badRequestErr(
					`The ${varName} name should not consist of numbers or any special characters`
				);
		});
	return cleanName;
};

const isValidUserName = (username) => {
	username = isValidStr(username, "Username", "min", 3);
	username = isValidStr(username, "Username", "max", 20);
	username.split("").forEach((char) => {
		if (!isLetterChar(char) && !isNumberChar(char))
			throw badRequestErr(
				"Username should only consist of alphanumeric characters"
			);
	});
	return username.toLowerCase();
};

/**
 *
 * @param {string} password
 * @returns {string} hash of the password
 */
const hashPassword = async (password) => {
	try {
		const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
		return hash;
	} catch (e) {
		throw internalServerErr("Error hashing password. Please try again");
	}
};

/**
 *
 * @param {string} password plain text password to compare
 * @param {string} hash hash of the password from DB
 * @returns {boolean} result of the comparision or throws an error
 */
const comparePassword = async (password, hash) => {
	try {
		const isSame = await bcrypt.compare(password, hash);
		return isSame;
	} catch (e) {
		throw internalServerErr("Error checking password. Please try again");
	}
};

const isValidPassword = (password) => {
	if (typeof password === "string" && password.includes(" "))
		throw badRequestErr("Password cannot contain spaces");
	password = isValidStr(password, "Password", "min", 6);
	const uppercaseLetterArr = [];
	const lowercaseLetterArr = [];
	const numberArr = [];
	const specialCharArr = [];
	password.split("").forEach((char) => {
		if (isNumberChar(char)) numberArr.push(char);
		else if (char >= "A" && char <= "Z") uppercaseLetterArr.push(char);
		else if (isLetterChar(char)) lowercaseLetterArr.push(char);
		else specialCharArr.push(char);
	});
	if (
		uppercaseLetterArr.length === 0 ||
		numberArr.length === 0 ||
		specialCharArr.length === 0 ||
		lowercaseLetterArr.length === 0
	)
		throw badRequestErr(
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
		);
	return password;
};

const isValidUserObj = (userObj) => ({
	name: isValidName(userObj.name, "User's"),
	username: isValidUserName(userObj.username),
	password: isValidPassword(userObj.password),
});

const isValidUserLoginObj = (userLoginObj) => ({
	username: isValidUserName(userLoginObj.username),
	password: isValidPassword(userLoginObj.password),
});

const isValidIngredients = (ingredientsArr) => {
	isValidArray(ingredientsArr, "Ingredients", "min", 3);
	return ingredientsArr.map((ingredient, index) => {
		ingredient = isValidStr(
			ingredient,
			`Ingredient at index ${index}`,
			"min",
			3
		);
		ingredient = isValidStr(
			ingredient,
			`Ingredient at index ${index}`,
			"max",
			50
		);
		let hasLetters = false;
		ingredient.split("").forEach((char) => {
			if (!hasLetters && isLetterChar(char)) hasLetters = true;
		});
		if (!hasLetters)
			throw badRequestErr(
				`Invalid ingredient at index ${index}: No letters found`
			);
		return ingredient;
	});
};

const isValidCookingSteps = (stepsArr) => {
	isValidArray(stepsArr, "Cooking Steps", "min", 5);
	return stepsArr.map((step, index) => {
		step = isValidStr(step, `Step at index ${index}`, "min", 20);
		let hasLetters = false;
		step.split("").forEach((char) => {
			if (!hasLetters && isLetterChar(char)) hasLetters = true;
		});
		if (!hasLetters)
			throw badRequestErr(`Invalid step at index ${index}: No letters found`);
		return step;
	});
};

const isValidCookingSkill = (skill) => {
	skill = isValidStr(skill, "Cooking Skill");
	skill = skill.trim().toLowerCase();
	if (!cookingSkills.includes(skill))
		throw badRequestErr(
			"Invalid Cooking skill, must be one of Novice, Intermediate, Advanced"
		);
	return skill;
};

const isValidRecipeTitle = (title) => {
	title = isValidStr(title, "Title", "min", 3);
	title = isValidStr(title, "Title", "max", 50);
	let hasLetters = false;
	title.split("").forEach((char) => {
		if (!hasLetters && isLetterChar(char)) hasLetters = true;
		if (
			!isLetterChar(char) &&
			!isNumberChar(char) &&
			!["'", "-", " ", ""].includes(char.trim())
		)
			throw badRequestErr(`Invalid recipe title: ${char} not allowed`);
	});
	if (!hasLetters)
		throw badRequestErr("Invalid recipe title: Did not find any letters");
	return title;
};

const isValidRecipe = (recipeObj) => {
	if (!isValidObj(recipeObj))
		throw badRequestErr("Request body needs to be an object");
	return {
		title: isValidRecipeTitle(recipeObj.title),
		ingredients: isValidIngredients(recipeObj.ingredients),
		steps: isValidCookingSteps(recipeObj.steps),
		cookingSkillRequired: isValidCookingSkill(recipeObj.cookingSkillRequired),
	};
};

const isValidUpdateRecipeObj = (recipeObj) => {
	const obj = {};
	if (!isValidObj(recipeObj))
		throw badRequestErr("Request body needs to be an object");
	if (Object.keys(recipeObj).length === 0)
		throw badRequestErr(
			"You need to provide at least one value that needs to be updated"
		);
	if ("title" in recipeObj) obj.title = isValidRecipeTitle(recipeObj.title);
	if ("ingredients" in recipeObj)
		obj.ingredients = isValidIngredients(recipeObj.ingredients);
	if ("steps" in recipeObj) obj.steps = isValidCookingSteps(recipeObj.steps);
	if ("cookingSkillRequired" in recipeObj)
		obj.cookingSkillRequired = isValidCookingSkill(
			recipeObj.cookingSkillRequired
		);
	return obj;
};

const isValidCurrUser = (userObj) => ({
	_id: isValidObjectId(userObj._id).toString(),
	username: isValidUserName(userObj.username),
});

const isValidPage = (pageStr) => {
	if (!pageStr || pageStr.trim().length === 0) return "1";
	const page = pageStr.trim();
	page.split("").forEach((char) => {
		if (!isNumberChar(char))
			throw badRequestErr("Invalid page number provided");
	});
	return page;
};

module.exports = {
	error,
	badRequestErr,
	notFoundErr,
	internalServerErr,
	unauthorizedErrorObj,
	forbiddenErrorObj,
	sendErrResp,
	isValidStr,
	isValidObjectId,
	comparePassword,
	hashPassword,
	isValidUserName,
	isValidUserObj,
	isValidUserLoginObj,
	isValidRecipe,
	isValidUpdateRecipeObj,
	isValidCurrUser,
	isValidPage,
};
