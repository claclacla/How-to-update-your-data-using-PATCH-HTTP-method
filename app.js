var express = require('express');
var bodyParser = require('body-parser');
var config = require("config");

var recipeId = config.get("recipe.id");
var recipeName = config.get("recipe.name");

var ForerunnerDB = require("forerunnerdb");
var fdb = new ForerunnerDB();
var db = fdb.db("RecipePatchDB");

var RecipeEntity = require("./models/RecipeEntity");
var RecipeRoute = require('./routes/RecipeRoute');
var RecipeForeRunnerDBRepository = require('./repositories/RecipeForeRunnerDBRepository');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Remove each value from recipe collection for example purpose

var recipeCollection = db.collection("recipe");
recipeCollection.remove({});

var repository = new RecipeForeRunnerDBRepository(db);

// Add a default value into repository for example purpose

var recipe = new RecipeEntity();
recipe.id = recipeId;
recipe.name = recipeName;

repository.add(recipe).then(() => {

}, err => {
  throw new Error(err);
});

// Init recipeRoute with its PATCH method

var recipeRoute = new RecipeRoute(repository);
app.use('/recipe/:id', recipeRoute.patchRecipe.bind(recipeRoute)); // .bind() needed to refer to recipeRoute object

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message
  });
});

module.exports = app;
