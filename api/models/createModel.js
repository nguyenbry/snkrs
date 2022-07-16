const mongoose = require("mongoose")

function createModel(schema, name) {
  return mongoose.model(name, new mongoose.Schema(schema))
}

function createRef(refName) {
  return { type: mongoose.SchemaTypes.ObjectId, ref: refName }
}

module.exports = {
  createModel,
  createRef,
}
