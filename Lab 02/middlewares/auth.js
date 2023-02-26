const { getUserByUserId } = require("../data/users");
const {
	sendErrResp,
	unauthorizedErrorObj,
	badRequestErr,
} = require("../utils");

const authenticate = async (req, res, next) => {
	try {
		if (!req.session.user)
			throw unauthorizedErrorObj(
				"You must be logged in before performing this action"
			);
		try {
			const user = await getUserByUserId(req.session.user._id);
			if (
				!user ||
				req.session.user.username.toLowerCase().trim() !==
					user.username.toLowerCase().trim()
			)
				throw new Error();
		} catch (e) {
			req.session.destroy();
			throw badRequestErr(
				"Invalid credentials. Session has been expired, please login again"
			);
		}
		next();
	} catch (e) {
		sendErrResp(res, e);
	}
};

module.exports = authenticate;
