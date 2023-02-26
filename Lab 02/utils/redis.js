const redis = require("redis");
const { getRecipeById } = require("../data/recipes");
const client = redis.createClient();
client.connect().then(() => {});
client.on("error", (err) => console.log("Redis Client Error", err));

const cacheRecipe = async (recipe) => {
	await client.set(
		`20012198_${recipe._id.toString()}`,
		JSON.stringify({ recipe })
	);
	await client.zIncrBy("20012198_popularRecipes", 1, recipe._id.toString());
};

const updateCacheRecipe = async (recipe) => {
	await cacheRecipe(recipe);
	await clearPagesCache();
};

const cacheRecipePage = async (recipes, page) => {
	await client.set(`20012198_allRecipes_${page}`, JSON.stringify({ recipes }));
};

const clearPagesCache = async () => {
	const keys = await client.keys("20012198_allRecipes_*");
	console.log(keys);
	await Promise.all(
		keys.map(async (key) => {
			await client.del(key);
		})
	);
};

const getMostPopularRecipes = async () => {
	const recipeIds = await client.zRange("20012198_popularRecipes", 0, 9, {
		REV: true,
	});
	const recipes = await Promise.all(
		recipeIds.map(async (id) => {
			let recipe;
			const exists = await client.exists(`20012198_${id}`);
			if (!exists) {
				recipe = await getRecipeById(id);
				await client.set(`20012198_${id}`, JSON.stringify({ recipe }));
			} else recipe = await client.get(`20012198_${id}`).then(JSON.parse);
			return recipe;
		})
	);
	return recipes;
};

module.exports = {
	cacheRecipe,
	updateCacheRecipe,
	cacheRecipePage,
	clearPagesCache,
	getMostPopularRecipes,
};
