const express = require("express");
const configRoutes = require("./routes");
const session = require("express-session");
const redisMiddleware = require("./middlewares/redis");

const SECRET = "thismyreallysecuresecret";

const app = express();
app.use(express.json());

const routesCounter = {};
const loggingMiddleware = async (req, res, next) => {
	let reqBody = {};
	if (req.method !== "GET") reqBody = { ...req.body };
	if ("password" in reqBody) delete reqBody.password;
	if (req.originalUrl in routesCounter) routesCounter[req.originalUrl] += 1;
	else routesCounter[req.originalUrl] = 1;
	console.log(
		`${req.method} ${req.originalUrl}: ${routesCounter[req.originalUrl]}`
	);
	console.log("Request Body:");
	console.log(reqBody);
	console.log();
	next();
};

app.use(
	session({
		name: "AuthCookie",
		secret: SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use("/", loggingMiddleware);
app.use("/", redisMiddleware);

configRoutes(app);

app.listen(3000, () => {
	console.log("Server started on port 3000!");
});
