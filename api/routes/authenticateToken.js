const { verify } = require("jsonwebtoken")
const {
  applyStatusAndError,
  ERROR_TYPES,
} = require("../utils/routeErrorHandling")

function authenticate(req, res, next) {
  console.log('headers', req.headers);
  const authHeader = req.headers["authorization"]

  const token = authHeader && authHeader.replace("Bearer ", "")
  if (!token) {
    console.log("no token")
    applyStatusAndError(res, 401, "Invalid credentials", ERROR_TYPES.EXPECTED)
  }
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("failed jwt verification", err)
      return applyStatusAndError(
        res,
        401,
        "Invalid credentials",
        ERROR_TYPES.EXPECTED
      )
    }
    req.user = user
    next()
  })
}

module.exports = authenticate
