var config = require("config");

var recipeId = config.get("recipe.id");
var recipeName = config.get("recipe.name");
var recipeType = config.get("recipe.type");
var recipeIngredients = config.get("recipe.ingredients");

var RecipeEntity = require("../../models/RecipeEntity");

var PatchAdd = require("./PatchAdd");
var PatchRemove = require("./PatchRemove");
var PatchReplace = require("./PatchReplace");
var PatchMove = require("./PatchMove");
var PatchCopy = require("./PatchCopy");
var PatchTest = require("./PatchTest");

suite('PATCH API test', function () {
  before(function () {

  });

  new PatchAdd().exec();
  new PatchRemove().exec();
  new PatchReplace().exec();
  new PatchMove().exec();
  new PatchCopy().exec();
  new PatchTest().exec();

  after(function () {

  });
});
