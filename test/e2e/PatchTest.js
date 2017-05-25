var config = require("config");
var supertest = require("supertest");
var assert = require("assert");

var appPort = config.get("app.port");
var server = supertest.agent("http://localhost:" + appPort);

var recipeId = config.get("recipe.id");
var recipeChef = config.get("recipe.chef");

var time = 5;

module.exports = function () {
  return {
    exec: function () {
      suite('Patch test operation', function () {
        suite('Number test', function () {
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

          test("Should return status: 200 when 'preparationTime' property equal to '" + time + "'", function (done) {
            server
              .patch('/recipe/' + recipeId)
              .send([{
                op: "test",
                path: "/preparationTime",
                value: time
              }])
              .expect("Content-type", /json/)
              .expect(200)
              .end(function (err, res) {
                if (err) throw err;

                done();
              });
          });

          test("Should return status: 409 when 'preparationTime' property equal to '" + (time + 1) + "'", function (done) {
            server
              .patch('/recipe/' + recipeId)
              .send([{
                op: "test",
                path: "/preparationTime",
                value: (time + 1)
              }])
              .expect("Content-type", /json/)
              .expect(409)
              .end(function (err, res) {
                if (err) throw err;

                done();
              });
          });
        });

        suite('Object test', function () {
          test("Should return a recipe object with a 'chef' property equal to {name: '" + recipeChef.name + "', surname: '" + recipeChef.surname + "'}", function (done) {
            server
              .patch('/recipe/' + recipeId)
              .send([{
                op: "add",
                path: "/chef",
                value: recipeChef
              }])
              .expect("Content-type", /json/)
              .expect(200)
              .end(function (err, res) {
                if (err) throw err;

                assert(res.body.data.hasOwnProperty("chef"), "The recipe has NOT 'chef' property");
                assert(res.body.data.chef.name === recipeChef.name, "The recipe chef name is NOT '" + recipeChef.name + "'");
                assert(res.body.data.chef.surname === recipeChef.surname, "The recipe chef surname is NOT '" + recipeChef.surname + "'");

                done();
              });
          });

          test("Should return status: 200 when 'chef' property equal to {name: '" + recipeChef.name + "', surname: '" + recipeChef.surname + "'}", function (done) {
            server
              .patch('/recipe/' + recipeId)
              .send([{
                op: "test",
                path: "/chef",
                value: recipeChef
              }])
              .expect("Content-type", /json/)
              .expect(200)
              .end(function (err, res) {
                if (err) throw err;

                done();
              });
          });
        });
      });
    }
  }
}
