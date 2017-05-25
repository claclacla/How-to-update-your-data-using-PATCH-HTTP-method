var assert = require("assert");
var config = require("config");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
var db = fdb.db("RecipePatchDB");

var recipeId = config.get("recipe.id");
var recipeName = config.get("recipe.name");
var recipeType = config.get("recipe.type");

var RecipeEntity = require("../../models/RecipeEntity");
var RecipeForeRunnerDBRepository = require("../../repositories/RecipeForeRunnerDBRepository");

suite('RecipeForeRunnerDBRepository test', function () {
  before(function () {
    this.recipeRepository = new RecipeForeRunnerDBRepository(db);
  });

  test("Should add a new RecipeEntity {_id: " + recipeId + "} into RecipeForeRunnerDBRepository", function (done) {
    var recipe = new RecipeEntity();
    recipe.id = recipeId;
    recipe.name = recipeName;

    this.recipeRepository.add(recipe).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should update the RecipeEntity {_id: " + recipeId + "} from RecipeForeRunnerDBRepository", function (done) {
    var recipe = new RecipeEntity();
    recipe.id = recipeId;
    recipe.name = recipeName;
    recipe.type = recipeType;

    this.recipeRepository.update({
      _id: recipeId
    }, recipe).then(() => {
      done();
    }, err => {
      throw new Error(err);
    });
  });

  test("Should get the RecipeEntity {_id: " + recipeId + "} from RecipeForeRunnerDBRepository", function (done) {
    this.recipeRepository.getById(recipeId).then((recipe) => {
      assert(recipe instanceof RecipeEntity, "The repository recipe is NOT an object");
      assert(recipe._id === recipeId, "The recipe id is NOT == " + recipeId + ", but:" + recipe.id);
      assert(recipe.name === recipeName, "The recipe name is NOT == '" + recipeName + "', but:" + recipe.name);
      assert(recipe.type === recipeType, "The recipe type name is NOT == '" + recipeType + "', but:" + recipe.type);

      done();
    }, err => {
      throw new Error(err);
    });
  });

  after(function () {

  });
});
