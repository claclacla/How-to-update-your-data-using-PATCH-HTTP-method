var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var recipeId = config.get("recipe.id");
var recipeName = config.get("recipe.name");
var recipeType = config.get("recipe.type");
var recipeIngredients = config.get("recipe.ingredients");

var preReplaceRecipeType = "Salad";

module.exports = function () {
  return {
    exec: function () {
      suite('Patch replace operation', function () {
        test("Should return a recipe object with a 'type' property equal to '" + preReplaceRecipeType + "'", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/type",
              value: preReplaceRecipeType
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("type"), "The recipe has NOT 'type' property");
              assert(res.body.data.type === preReplaceRecipeType, "The recipe type is NOT '" + preReplaceRecipeType + "'");

              done();
            });
        });

        test("Should return a recipe object with a 'type' property equal to '" + recipeType + "'", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "replace",
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
      });
    }
  }
}
