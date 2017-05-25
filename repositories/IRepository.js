class IRepository {
  constructor() {
    if (this.add === undefined) {
      throw new TypeError("Must override .add() method");
    }

    if (this.update === undefined) {
      throw new TypeError("Must override .update() method");
    }

    if (this.getById === undefined) {
      throw new TypeError("Must override .getById() method");
    }
  }

  add() {

  }

  update() {

  }

  getById() {

  }
}

module.exports = IRepository
