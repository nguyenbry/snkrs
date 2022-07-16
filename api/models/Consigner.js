const { createModel, createRef } = require("./createModel")

module.exports = createModel(
  {
    consignerId: {
      type: Number,
      required: true,
      immutable: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    password: {
      type: String,
    },
    items: [createRef("item")],
    user: createRef("user"),
  },
  "consigner"
)
