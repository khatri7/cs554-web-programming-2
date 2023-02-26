const { users } = require("../config/mongoCollections");
const {
	isValidUserName,
	isValidUserObj,
	hashPassword,
	isValidUserLoginObj,
	comparePassword,
	isValidObjectId,
	notFoundErr,
	badRequestErr,
	internalServerErr,
} = require("../utils");

const getUserByUserId = async (userId) => {
	const _id = isValidObjectId(userId);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ _id });
	if (!user) throw notFoundErr("No user found for the provided user Id");
	return user;
};

const getUserByUsername = async (usernameParam) => {
	const username = isValidUserName(usernameParam);
	const usersCollection = await users();
	const user = await usersCollection.findOne({ username });
	if (!user) throw notFoundErr("No user found for the provided username");
	return user;
};

const checkUsernameAvailable = async (usernameParam) => {
	const username = isValidUserName(usernameParam);
	let user = null;
	try {
		user = await getUserByUsername(username);
	} catch (e) {
		if (e.status === 404) return true;
		else throw e;
	}
	if (user && user.username.toLowerCase() === username.toLowerCase())
		throw badRequestErr("The username provided has already been taken");
	return true;
};

const createUser = async (name, username, password) => {
	const userObj = isValidUserObj({
		name,
		username,
		password,
	});
	await checkUsernameAvailable(userObj.username);
	const passwordHash = await hashPassword(userObj.password);
	const usersCollection = await users();
	const result = await usersCollection.insertOne({
		...userObj,
		password: passwordHash,
	});
	if (!result?.acknowledged || !result?.insertedId)
		throw internalServerErr("Could not insert user into DB");
	const user = await getUserByUsername(userObj.username);
	return {
		_id: user._id,
		name: user.name,
		username: user.username,
	};
};

const authenticateUser = async (username, password) => {
	const userLoginObj = isValidUserLoginObj({
		username,
		password,
	});
	let user;
	try {
		user = await getUserByUsername(userLoginObj.username);
		const doPasswordsMatch = await comparePassword(
			userLoginObj.password,
			user.password
		);
		if (!doPasswordsMatch) throw badRequestErr("Password mismatch error");
	} catch (e) {
		if (e.status === 400 || e.status === 404)
			throw badRequestErr("Either the username or password is invalid");
		else throw e;
	}
	return {
		_id: user._id,
		name: user.name,
		username: user.username,
	};
};

module.exports = {
	getUserByUserId,
	createUser,
	authenticateUser,
};
