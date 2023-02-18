const { ObjectId } = require("mongodb");
const { recipes } = require("../config/mongoCollections");
const {
	isValidObjectId,
	notFoundErr,
	isValidRecipe,
	isValidCurrUser,
	isValidStr,
	forbiddenErrorObj,
	isValidPage,
	isValidUpdateRecipeObj,
	internalServerErr,
	badRequestErr,
} = require("../helpers");

const getAllRecipes = async (pageStr) => {
	const itemsPerPage = 50;
	const page = parseInt(isValidPage(pageStr));
	const skip = itemsPerPage * (page - 1);
	const recipesCollection = await recipes();
	const recipesList = await recipesCollection
		.find({})
		.skip(skip)
		.limit(itemsPerPage)
		.toArray();
	if (recipesList.length === 0) throw notFoundErr("No recipes found");
	return recipesList;
};

const getRecipeById = async (recipeId) => {
	const _id = isValidObjectId(recipeId);
	const recipesCollection = await recipes();
	const recipe = await recipesCollection.findOne({ _id });
	if (!recipe)
		throw notFoundErr("Could not find recipe with provided recipe Id");
	return recipe;
};

const createRecipe = async (recipeObj, currUserObj) => {
	const currUser = isValidCurrUser(currUserObj);
	currUser._id = ObjectId(currUser._id);
	const recipe = {
		...isValidRecipe(recipeObj),
		comments: [],
		likes: [],
		userThatPosted: currUser,
	};
	const recipesCollection = await recipes();
	const result = await recipesCollection.insertOne(recipe);
	if (!result?.acknowledged || !result?.insertedId)
		throw internalServerErr("Could not insert user into DB");
	const newRecipe = await getRecipeById(result.insertedId.toString());
	return newRecipe;
};

const updateRecipe = async (recipeId, updateRecipeObj, currUserObj) => {
	const _id = isValidObjectId(recipeId);
	const recipe = await getRecipeById(_id.toString());
	const updateObj = isValidUpdateRecipeObj(updateRecipeObj);
	const currUser = isValidCurrUser(currUserObj);
	if (
		recipe.userThatPosted._id.toString() !== currUser._id ||
		recipe.userThatPosted.username.toLowerCase() !==
			currUser.username.toLowerCase()
	)
		throw forbiddenErrorObj(
			"You cannot update a recipe created by someone else"
		);
	const recipesCollection = await recipes();
	const result = await recipesCollection.updateOne(
		{ _id },
		{
			$set: {
				...recipe,
				...updateObj,
			},
		}
	);
	if (!result || result.matchedCount === 0)
		throw notFoundErr("Could not find recipe with given Id");
	if (!result || result.modifiedCount === 0)
		throw badRequestErr(
			"Could not update details, as all the fields are the same as before"
		);
	const updatedRecipe = await getRecipeById(_id.toString());
	return updatedRecipe;
};

const createComment = async (recipeId, comment, currUserObj) => {
	recipeId = isValidObjectId(recipeId);
	await getRecipeById(recipeId.toString());
	comment = isValidStr(comment, "Comment");
	const currUser = isValidCurrUser(currUserObj);
	currUser._id = ObjectId(currUser._id);
	const commentObj = {
		_id: new ObjectId(),
		comment,
		userThatPostedComment: currUser,
	};
	const recipesCollection = await recipes();
	const commentAcknowledgement = await recipesCollection.updateOne(
		{ _id: recipeId },
		{ $push: { comments: commentObj } }
	);
	if (
		!commentAcknowledgement.acknowledged ||
		!commentAcknowledgement.modifiedCount
	)
		throw internalServerErr("Could not upload the comment. Please try again");
	return await getRecipeById(recipeId.toString());
};

const getCommentByCommentId = async (recipeId, commentId) => {
	recipeId = isValidObjectId(recipeId);
	const _id = isValidObjectId(commentId);
	const recipesCollection = await recipes();
	const recipe = await recipesCollection.findOne({
		comments: { $elemMatch: { _id } },
	});
	if (!recipe || recipe._id.toString() !== recipeId.toString())
		throw notFoundErr(
			"No comment found for the provided recipe and comment id combination"
		);
	const comment = recipe.comments.find(
		(comment) => comment._id.toString() === _id.toString()
	);
	if (!comment)
		throw notFoundErr(
			"No comment found for the provided recipe and comment id combination"
		);
	return comment;
};

const removeComment = async (recipeId, commentId, currUserObj) => {
	recipeId = isValidObjectId(recipeId);
	commentId = isValidObjectId(commentId);
	const currUser = isValidCurrUser(currUserObj);
	await getRecipeById(recipeId.toString());
	const comment = await getCommentByCommentId(
		recipeId.toString(),
		commentId.toString()
	);
	if (
		comment.userThatPostedComment._id.toString() !== currUser._id ||
		comment.userThatPostedComment.username.toLowerCase() !==
			currUser.username.toLowerCase()
	)
		throw forbiddenErrorObj(
			"You cannot delete a comment created by someone else"
		);
	const recipesCollection = await recipes();
	const removeCommentAcknowledgement = await recipesCollection.updateOne(
		{ _id: recipeId },
		{ $pull: { comments: { _id: commentId } } }
	);
	if (
		!removeCommentAcknowledgement.acknowledged ||
		!removeCommentAcknowledgement.modifiedCount
	)
		throw internalServerErr("Could not delete the comment. Please try again");
	const updatedRecipe = await getRecipeById(recipeId.toString());
	return updatedRecipe;
};

const updateUserLike = async (recipeId, currUserObj) => {
	const _id = isValidObjectId(recipeId);
	const currUser = isValidCurrUser(currUserObj);
	const recipe = await getRecipeById(_id.toString());
	const likes = recipe.likes.map((like) => like.toString());
	const recipesCollection = await recipes();
	let acknowledgement;
	if (likes.includes(currUser._id)) {
		likes.splice(likes.indexOf(currUser._id), 1);
		const updatedLikes = likes.map((like) => ObjectId(like));
		acknowledgement = await recipesCollection.updateOne(
			{
				_id,
			},
			{
				$set: { likes: updatedLikes },
			}
		);
	} else {
		acknowledgement = await recipesCollection.updateOne(
			{
				_id,
			},
			{
				$push: { likes: ObjectId(currUser._id) },
			}
		);
	}
	if (!acknowledgement.acknowledged || !acknowledgement.modifiedCount)
		throw internalServerErr("Could not update likes. Please try again");
	const updatedRecipe = await getRecipeById(_id.toString());
	return updatedRecipe;
};

module.exports = {
	getAllRecipes,
	getRecipeById,
	getCommentByCommentId,
	createRecipe,
	updateRecipe,
	createComment,
	removeComment,
	updateUserLike,
};
