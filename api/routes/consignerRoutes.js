const Product = require("../models/Product")
const Item = require("../models/Item")
const Consigner = require("../models/Consigner")
const User = require("../models/User")
const {
  applyStatusAndError,
  ERROR_TYPES,
} = require("../utils/routeErrorHandling")
const { encrypt, decrypt } = require("../utils/Fernet")
const authenticate = require("./authenticateToken")

async function attachConsigner(req, res) {
  console.log("attempting attach")
  const { user } = req

  if (user.consigner) {
    return res.status(400).json("Consigner account already exists")
  }

  const mongoUser = await User.findById(user._id)

  if (!mongoUser) {
    return applyStatusAndError(
      res,
      400,
      "User no longer exists",
      ERROR_TYPES.UNEXPECTED
    )
  }
  // we use fulltrace requests on the frontend and pass in their consignerId
  const { refreshToken, consignerId, email, password } = req.body

  const consigner = await new Consigner({
    consignerId, // the fulltrace consigner number
    email: email,
    password: encrypt(password),
    user: user._id,
  }).save()

  mongoUser.consigner = consigner._id
  const savedMongoUser = await mongoUser.save()
  console.log("jwt user", user)
  console.log("mongo user old", mongoUser)
  console.log("new consigner", consigner)
  console.log("new mongo user", savedMongoUser)
  return res.status(200).json(consigner)
}

function useRoutes(app) {
  app.post("/consigner", authenticate, attachConsigner)
}

module.exports = useRoutes
