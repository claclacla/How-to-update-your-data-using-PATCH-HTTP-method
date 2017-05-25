var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var recipeId = config.get("recipe.id");

var time = 5;

module.exports = function () {
  return {
    exec: function () {
      suite('Patch move operation', function () {
        test("Should return a recipe object with a 'preparationTime' property equal to '" + time + "'", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "add",
              path: "/preparationTime",
              value: time
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(res.body.data.hasOwnProperty("preparationTime"), "The recipe has NOT 'preparationTime' property");
              assert(res.body.data.preparationTime === time, "The recipe preparationTime is NOT '" + time + "'");

              done();
            });
        });

        test("Should return a recipe object without 'preparationTime' property and with a 'cookingTime' property equal to '" + time + "'", function (done) {
          server
            .patch('/recipe/' + recipeId)
            .send([{
              op: "move",
              from: "/preparationTime",
              path: "/cookingTime"
            }])
            .expect("Content-type", /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) throw err;

              assert(!res.body.data.hasOwnProperty("preparationTime"), "The recipe has a 'preparationTime' property");
              assert(res.body.data.hasOwnProperty("cookingTime"), "The recipe has NOT 'cookingTime' property");
              assert(res.body.data.cookingTime === time, "The recipe cookingTime is NOT '" + time + "'");

              done();
            });
        });
      });
    }
  }
}
