const {
  applyStatusAndError,
  ERROR_TYPES,
} = require("../utils/routeErrorHandling")

function validateLogin(req, res, next) {
  const { email, password } = req.body

  // handles if email/password are null OR undefined
  if (email == null || password == null) {
    console.log("Here")
    return applyStatusAndError(
      res,
      400,
      "Both email and password are required",
      ERROR_TYPES.EXPECTED
    )
  }

  req.body.email = req.body.email.trim().toLowerCase()
  console.log("Here1")
  next()
}

module.exports = {
  validateLogin,
}
