const { usersData } = require("../data");
const {
	sendErrResp,
	isValidUserObj,
	isValidUserLoginObj,
	badRequestErr,
} = require("../helpers");
const recipeRoutes = require("./recipes");

const constructorMethod = (app) => {
	app.use("/recipes", recipeRoutes);

	app.post("/signup", async (req, res) => {
		try {
			if (req.session.user)
				throw badRequestErr(
					"Please logout of current session before creating account"
				);
			const registerObj = isValidUserObj({
				name: req.body.name,
				username: req.body.username,
				password: req.body.password,
			});
			const user = await usersData.createUser(
				registerObj.name,
				registerObj.username,
				registerObj.password
			);
			if (!user) throw internalServerErr("Error inserting user into DB");
			res.status(201).json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

	app.post("/login", async (req, res) => {
		try {
			if (req.session.user)
				throw badRequestErr(
					"You are already logged in. Logout of current session to login to a different account"
				);
			const loginObj = isValidUserLoginObj({
				username: req.body.username,
				password: req.body.password,
			});
			const user = await usersData.authenticateUser(
				loginObj.username,
				loginObj.password
			);
			if (!user)
				throw badRequestErr("Either the username or password is invalid");
			req.session.user = {
				_id: user._id.toString(),
				username: user.username,
			};
			res.status(201).json({ user });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

	app.get("/logout", async (req, res) => {
		try {
			if (!req.session.user) throw badRequestErr("You must be logged in first");
			req.session.destroy();
			res.json({ message: "You have been successfully logged out" });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

	app.use("*", (req, res) => {
		res.status(404).json({ message: "Route not found" });
	});
};

module.exports = constructorMethod;
