var RecipeEntity = require("../models/RecipeEntity");
var IRepository = require("./IRepository");

class RecipeLowDBRepository extends IRepository {
  constructor(db) {
    super();

    this.collection = db.collection("recipe");
  }

  add(recipe) {
    return new Promise((resolve, reject) => {
      if (!recipe instanceof RecipeEntity) return reject("The first argument is NOT a RecipeEntity");

      this.collection
        .insert(recipe);

      resolve();
    });
  }

  update(query, recipe) {
    return new Promise((resolve, reject) => {
      if (!query instanceof Object) return reject("The first argument is NOT a valid object");
      if (!recipe instanceof RecipeEntity) return reject("The second argument is NOT a RecipeEntity");

      this.collection
        .update(query, {
          $replace: recipe
        });

      resolve();
    });
  }

  getById(_id) {
    return new Promise((resolve, reject) => {
      if (isNaN(_id)) return reject("The first argument is NOT a number");

      var dbRecipeResults = this.collection
        .find({
          _id: _id
        });

      if (dbRecipeResults.length == 0) {
        return reject("RecipeEntity NOT found on recipe collection");
      }

      var dbRecipe = dbRecipeResults[0];

      if (typeof dbRecipe !== "object" ||
        !dbRecipe.hasOwnProperty("_id") || !dbRecipe.hasOwnProperty("name")) {
        return reject("RecipeEntity NOT found on recipe collection");
      }

      var recipe = new RecipeEntity();
      recipe.id = dbRecipe._id;
      recipe.name = dbRecipe.name;

      if (dbRecipe.hasOwnProperty("preparationTime")) {
        recipe.preparationTime = dbRecipe.preparationTime;
      }

      if (dbRecipe.hasOwnProperty("cookingTime")) {
        recipe.cookingTime = dbRecipe.cookingTime;
      }

      if (dbRecipe.hasOwnProperty("type")) {
        recipe.type = dbRecipe.type;
      }

      if (dbRecipe.hasOwnProperty("ingredients")) {
        recipe.ingredients = dbRecipe.ingredients;
      }

      if (dbRecipe.hasOwnProperty("chef")) {
        recipe.chef = dbRecipe.chef;
      }

      resolve(recipe);
    });
  }
}

module.exports = RecipeLowDBRepository
