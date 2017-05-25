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
      suite('Patch remove operation', function () {
        test("Should return a recipe object without 'type' property", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "remove",
              path: "/type"
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(!res.body.data.hasOwnProperty("type"), "The recipe has 'type' property");

              done();
            });
        });

        // Add an element to an existing array property for next remove test purpose.
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

        // Remove an element to an existing array property.
        // The index MUST not be greater than the array length.

        var previousIngredientsLength = 0;

        test("Should return a recipe object without an 'ingredients[0]' property equal to ['" + recipeIngredients[0] + "']", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "remove",
              path: "/ingredients/0"
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("ingredients"), "The recipe has NOT 'ingredients' property");
              assert(Array.isArray(res.body.data.ingredients), "The recipe property 'ingredients' is NOT an array");
              assert(res.body.data.ingredients[0] !== recipeIngredients[0], "The recipe property 'ingredients' is '" + recipeIngredients[0] + "'");

              previousIngredientsLength = res.body.data.ingredients.length;

              done();
            });
        });

        // To remove an item at the end of the array, can be used the '-' character

        test("Should return a recipe object with an 'ingredients' property length less than the previous test", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "remove",
              path: "/ingredients/-"
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("ingredients"), "The recipe has NOT 'ingredients' property");
              assert(Array.isArray(res.body.data.ingredients), "The recipe property 'ingredients' is NOT an array");
              assert(res.body.data.ingredients.length < previousIngredientsLength, "The recipe property 'ingredients' length is NOT less than the previous one");

              done();
            });
        });
      });
    }
  }
}
