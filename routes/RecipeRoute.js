var async = require('async');
var _ = require("lodash");

class RecipeRoute {
  constructor(repository) {
    this.repository = repository;

    this.ADD = "add";
    this.REMOVE = "remove";
    this.REPLACE = "replace";
    this.MOVE = "move";
    this.COPY = "copy";
    this.TEST = "test";

    this.PATCH_OPERATIONS = [
      this.ADD,
      this.REMOVE,
      this.REPLACE,
      this.MOVE,
      this.COPY,
      this.TEST
    ];
  }

  validateParams(params) {
    if (!params.hasOwnProperty("id")) {
      var error = new Error("No valid ID passed to URI");
      error.status = 500;
      throw error;
    }

    params.id = parseInt(params.id);

    if (isNaN(params.id)) {
      var error = new Error("No valid ID passed to URI");
      error.status = 500;
      throw error;
    }

    return params;
  }

  validateBody(body) {
    if (!Array.isArray(body)) {
      var error = new Error("The request body is NOT an array");
      error.status = 500;
      throw error;
    }

    body.forEach(operation => {
      var error_message = null;

      if (!operation.hasOwnProperty("op") || this.PATCH_OPERATIONS.indexOf(operation.op) < 0) {
        error_message = "The request body has NOT a valid 'op' patch property";
      }

      if ([this.MOVE, this.COPY].indexOf(operation.op) >= 0) {
        if (!operation.hasOwnProperty("from")) {
          error_message = "The request body has NOT a valid 'from' patch property for 'move' operation";
        }
      }

      if (!operation.hasOwnProperty("path") ||
        typeof operation.path !== "string" || !Array.isArray(operation.path.split("/"))) {
        error_message = "The request body has NOT a valid 'path' patch property";
      }

      if ([this.ADD, this.TEST, this.REPLACE].indexOf(operation.op) >= 0) {
        if (!operation.hasOwnProperty("value")) {
          error_message = "The request body has NOT a valid 'path' patch property";
        }
      }

      if (error_message) {
        var error = new Error(error_message);
        error.status = 500;
        throw error;
      }
    });

    return body;
  }

  pathParser(path) {
    if (path.length < 2) {
      throw new Error("path has NOT a valid format");
    }

    if (path[0] !== "/") {
      throw new Error("path has NOT a valid format");
    }

    path = path.substring(1);
    path = path.split("/");

    return path;
  }

  objectParser(object, path) {
    var property = object;

    for (var i = 0; i < path.length; i++) {
      var key = path[i];

      if (property[key] === undefined) {
        throw new Error("No property found");
      }

      property = property[key];
    }

    return property;
  }

  patchDocumentParser(entity, patchDocument) {
    patchDocument.forEach(opDocument => {
      try {
        var path = this.pathParser(opDocument.path);
        var propertyName = "";
        var lastProperty = path[path.length - 1];

        if (!isNaN(parseInt(lastProperty)) || lastProperty === "-") {
          if ([this.ADD, this.REMOVE].indexOf(opDocument.op) < 0) {
            throw new Error("Wrong operation path");
          }

          var arrayPosition = path.pop();
          propertyName = path.pop();
          var propertyObject = this.objectParser(entity, path);

          if (arrayPosition !== "-") {
            arrayPosition = parseInt(arrayPosition);
          }

          if (opDocument.op == this.ADD) {
            if (!Array.isArray(propertyObject[propertyName])) {
              propertyObject[propertyName] = [propertyObject[propertyName]];
            }

            if (arrayPosition === "-") {
              arrayPosition = propertyObject[propertyName].length;
            }

            if (arrayPosition > propertyObject[propertyName].length) {
              throw new Error("Wrong array position");
            }

            propertyObject[propertyName][arrayPosition] = opDocument.value;
          } else if (opDocument.op == this.REMOVE) {
            if (!Array.isArray(propertyObject[propertyName])) {
              throw new Error("Entity property is NOT an array");
            }

            if (arrayPosition === "-") {
              arrayPosition = propertyObject[propertyName].length - 1;
            }

            if (arrayPosition > propertyObject[propertyName].length) {
              throw new Error("Wrong array position");
            }

            propertyObject[propertyName].splice(arrayPosition, 1);
          }
        } else {
          propertyName = path.pop();
          var propertyObject = this.objectParser(entity, path);

          if ([this.ADD, this.REPLACE].indexOf(opDocument.op) >= 0) {
            propertyObject[propertyName] = opDocument.value;
          } else if (opDocument.op == this.REMOVE) {
            delete propertyObject[propertyName];
          } else if (opDocument.op == this.TEST) {
            if (!_.isEqual(propertyObject[propertyName], opDocument.value)) {
              throw new Error("The property has a different value");
            }
          } else if ([this.MOVE, this.COPY].indexOf(opDocument.op) >= 0) {
            var from = this.pathParser(opDocument.from);
            var fromPropertyName = from.pop();
            var fromPropertyObject = this.objectParser(entity, from);

            propertyObject[propertyName] = fromPropertyObject[fromPropertyName];

            if (opDocument.op == this.MOVE) {
              delete fromPropertyObject[fromPropertyName];
            }
          }
        }
      } catch (err) {
        throw new Error(err);
      }
    });

    return entity;
  }

  patchRecipe(req, res, next) {
    try {
      var params = this.validateParams(req.params);
      var _id = params.id;
    } catch (err) {
      return next(err);
    }

    try {
      var patchDocument = this.validateBody(req.body);
    } catch (err) {
      return next(err);
    }

    async.waterfall([
      (cb) => { // Get recipe by id
        this.repository.getById(_id).then((recipe) => {
          cb(null, recipe);
        }, err => {
          cb(err);
        });
      },
      (recipe, cb) => { // Update recipe
        try {
          recipe = this.patchDocumentParser(recipe, patchDocument);
        } catch (err) {
          var error = new Error(err);
          error.status = 409;
          return next(error);
        }

        this.repository.update({
          _id: _id
        }, recipe).then(() => {
          cb();
        }, err => {
          cb(err);
        });
      },
      (cb) => { // Get the updated recipe version
        this.repository.getById(_id).then((recipe) => {
          cb(null, recipe);
        }, err => {
          cb(err);
        });
      }
    ], (err, recipe) => {
      if (err) {
        var error = new Error(err);
        error.status = 500;
        return next(error);
      }

      res.send({
        data: recipe
      });
    });
  }
}

module.exports = RecipeRoute;
