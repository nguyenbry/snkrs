const Product = require("../models/Product")
const Item = require("../models/Item")
const Consigner = require("../models/Consigner")
const {
  applyStatusAndError,
  ERROR_TYPES,
} = require("../utils/routeErrorHandling")
const authenticate = require("./authenticateToken")

/**
 * Returns an array of items belonging to this consigner.
 *
 * Params: { consignerId }
 *
 *
 * By default, a certain subset of the model's keys are returned
 *
 * If some are specified in the path query, the defaults are turned
 * off. This is to
 */
async function getConsignersItems(req, res) {
  const { user } = req.user

  // const consigner = await Consigner.exists({ consignerId })

  if (!consigner) {
    return applyStatusAndError(
      res,
      400,
      "Consigner does not exist",
      ERROR_TYPES.EXPECTED
    )
  }

  const query = req.query

  const options = {
    projection:
      query.include != null
        ? query.include.split(",").reduce((ob, key) => {
            ob[key] = 1
            return ob
          }, {})
        : {
            _id: 1,
            itemId: 1,
            size: 1,
            location: 1,
            priceOriginal: 1,
            price: 1,
            payout: 1,
            status: 1,
            consigner: 0,
          },
  }

  try {
    const items = await Items.find({ consigner: consigner._id }, options)
    return res.status(200).json(items)
  } catch {
    applyStatusAndError(
      res,
      400,
      "Error finding items. Contact an admin",
      ERROR_TYPES.UNEXPECTED
    )
  }
}

async function updateItem(req, res) {
  const itemId = req.params.itemIds

  const payload = req.body

  const item = await Item.findByIdAndUpdate(itemId, payload, { new: true })

  return res.status(201).json(item)
}

function useRoutes(app) {
  app.get("/items/:consignerId?", authenticate, getConsignersItems)
  app.get("/item/:itemId", updateItem)
}

module.exports = useRoutes
