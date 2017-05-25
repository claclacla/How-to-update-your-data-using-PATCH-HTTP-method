var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var recipeId = config.get("recipe.id");
var recipeName = config.get("recipe.name");
var recipeType = config.get("recipe.type");
var recipeIngredients = config.get("recipe.ingredients");

module.exports = function () {
  return {
    exec: function () {
      suite('Patch add operation', function () {

        // The property target path MUST exists.
        // In this case /chef might already be a recipe property.

        test("Should return status: 409 when path is equal to 'restaurant.name' property", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/restaurant/name",
              value: "The Apple"
            }])
            .expect("Content-type", /json/)
            .expect(409)
            .end(function (err, res) {
              if (err) throw err;

              done();
            });
        });

        test("Should return a recipe object with a 'type' property equal to '" + recipeType + "'", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/type",
              value: recipeType
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("type"), "The recipe has NOT 'type' property");
              assert(res.body.data.type === recipeType, "The recipe type is NOT '" + recipeType + "'");

              done();
            });
        });

        // Add an element to an existing array property.
        // The index MUST not be greater than the array length.

        test("Should return a recipe object with an 'ingredients[0]' property equal to ['" + recipeIngredients[0] + "']", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/ingredients/0",
              value: recipeIngredients[0]
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("ingredients"), "The recipe has NOT 'ingredients' property");
              assert(Array.isArray(res.body.data.ingredients), "The recipe property 'ingredients' is NOT an array");
              assert(res.body.data.ingredients[0] === recipeIngredients[0], "The recipe property 'ingredients[0]' is NOT '" + recipeIngredients[0] + "'");

              done();
            });
        });

        // To append an item at the end of the array, can be used the '-' character

        test("Should return a recipe object with an 'ingredients' property with a last item equal to ['" + recipeIngredients[1] + "']", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/ingredients/-",
              value: recipeIngredients[1]
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("ingredients"), "The recipe has NOT 'ingredients' property");
              assert(Array.isArray(res.body.data.ingredients), "The recipe property 'ingredients' is NOT an array");

              var ingredientsLength = res.body.data.ingredients.length;
              assert(res.body.data.ingredients[ingredientsLength - 1] === recipeIngredients[1], "The recipe property 'ingredients' is NOT '" + recipeIngredients[1] + "'");

              done();
            });
        });
      });
    }
  }
}
