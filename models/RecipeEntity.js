var IEntity = require("./IEntity");

class RecipeEntity extends IEntity {
  constructor() {
    super();

    this.name = "";

    // this.type = "";
    // this.preparationTime = 0;
    // this.cookingTime = 0;
    // this.ingredients = [];
    // this.chef = {
    //   name: "",
    //   surname: ""
    // }
  }
}

module.exports = RecipeEntity
