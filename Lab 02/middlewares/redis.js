const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});
client.on("error", (err) => console.log("Redis Client Error", err));

const redisMiddleware = async (req, res, next) => {
	if (req.method === "GET" && req.originalUrl.includes("recipes")) {
		let key = "20012198_allRecipes_1";
		let incrementInScoreboard = false;
		let { page } = req.query;
		let recipeId = undefined;
		if (page) {
			page = page.trim();
			key = `20012198_allRecipes_${page}`;
		} else {
			recipeId = req.path.replace("/recipes/", "").trim();
			recipeId = recipeId.replace("/", "");
			if (recipeId) {
				key = `20012198_${recipeId}`;
				incrementInScoreboard = true;
			}
		}
		const exists = await client.exists(key);
		if (exists && incrementInScoreboard)
			await client.zIncrBy("20012198_popularRecipes", 1, recipeId);
		if (exists) {
			const resp = await client.get(key).then(JSON.parse);
			return res.json(resp);
		}
	}
	next();
};

module.exports = redisMiddleware;
