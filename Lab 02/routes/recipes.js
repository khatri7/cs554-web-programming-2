const express = require("express");
const { recipesData } = require("../data");
const { createRecipe } = require("../data/recipes");
const {
	sendErrResp,
	isValidObjectId,
	isValidRecipe,
	isValidStr,
	isValidCurrUser,
	isValidPage,
	isValidUpdateRecipeObj,
} = require("../utils");
const authenticate = require("../middlewares/auth");
const {
	cacheRecipe,
	updateCacheRecipe,
	cacheRecipePage,
} = require("../utils/redis");
const { redisAllRecipes, redisSingleRecipe } = require("../middlewares/redis");

const router = express.Router();

router
	.route("/")
	.get(redisAllRecipes, async (req, res) => {
		try {
			let { page } = req.query;
			page = isValidPage(page);
			const recipes = await recipesData.getAllRecipes(page);
			await cacheRecipePage(recipes, page);
			res.json({
				recipes,
			});
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.post(authenticate, async (req, res) => {
		try {
			const recipeObj = isValidRecipe(req.body);
			const recipe = await createRecipe(
				recipeObj,
				isValidCurrUser(req.session.user)
			);
			await updateCacheRecipe(recipe);
			res.status(201).json({ recipe });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router
	.route("/:recipeId")
	.get(redisSingleRecipe, async (req, res) => {
		try {
			const _id = isValidObjectId(req.params.recipeId);
			const recipe = await recipesData.getRecipeById(_id.toString());
			await cacheRecipe(recipe);
			res.json({ recipe });
		} catch (e) {
			sendErrResp(res, e);
		}
	})
	.patch(authenticate, async (req, res) => {
		try {
			const _id = isValidObjectId(req.params.recipeId);
			await recipesData.getRecipeById(_id.toString());
			const updatedRecipeObj = isValidUpdateRecipeObj(req.body);
			const recipe = await recipesData.updateRecipe(
				_id.toString(),
				updatedRecipeObj,
				isValidCurrUser(req.session.user)
			);
			await updateCacheRecipe(recipe);
			res.json({ recipe });
		} catch (e) {
			sendErrResp(res, e);
		}
	});

router.route("/:recipeId/comments").post(authenticate, async (req, res) => {
	try {
		const recipeId = isValidObjectId(req.params.recipeId);
		await recipesData.getRecipeById(recipeId.toString());
		let { comment } = req.body;
		comment = isValidStr(comment, "Comment");
		const recipe = await recipesData.createComment(
			recipeId.toString(),
			comment,
			isValidCurrUser(req.session.user)
		);
		await updateCacheRecipe(recipe);
		res.status(201).json({ recipe });
	} catch (e) {
		console.log(e);
		sendErrResp(res, e);
	}
});

router.route("/:recipeId/:commentId").delete(authenticate, async (req, res) => {
	try {
		const recipeId = isValidObjectId(req.params.recipeId);
		const commentId = isValidObjectId(req.params.commentId);
		await recipesData.getRecipeById(recipeId.toString());
		await recipesData.getCommentByCommentId(
			recipeId.toString(),
			commentId.toString()
		);
		const currUser = isValidCurrUser(req.session.user);
		const recipe = await recipesData.removeComment(
			recipeId.toString(),
			commentId.toString(),
			currUser
		);
		await updateCacheRecipe(recipe);
		res.json({ recipe });
	} catch (e) {
		sendErrResp(res, e);
	}
});

router.route("/:recipeId/likes").post(authenticate, async (req, res) => {
	try {
		const recipeId = isValidObjectId(req.params.recipeId);
		await recipesData.getRecipeById(recipeId.toString());
		const currUser = isValidCurrUser(req.session.user);
		const recipe = await recipesData.updateUserLike(
			recipeId.toString(),
			currUser
		);
		await updateCacheRecipe(recipe);
		res.status(201).json({ recipe });
	} catch (e) {
		sendErrResp(res, e);
	}
});

module.exports = router;
