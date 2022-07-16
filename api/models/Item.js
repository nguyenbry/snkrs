const mongoose = require("mongoose")
const { createModel, createRef } = require("./createModel")

module.exports = createModel(
  {
    itemId: {
      type: Number,
      required: true,
      immutable: true,
    },
    code: {
      type: String,
      required: true,
      immutable: true,
    },
    size: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      default: null,
    },
    priceOriginal: {
      type: String,
      required: true
    }, 
    price: {
      type: Number,
      required: true,
    },
    payout: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    consigner: createRef("consigner"),
  },
  "item"
)
