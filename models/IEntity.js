class IEntity {
  constructor() {

  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }
}

module.exports = IEntity
