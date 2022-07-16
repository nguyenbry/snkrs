const {
  applyStatusAndError,
  ERROR_TYPES,
} = require("../utils/routeErrorHandling")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { hash, compare } = require("../bcrypt/bcrypt")
const mongoose = require("mongoose")
const ValidatorError = mongoose.Error.ValidatorError
const ValidationError = mongoose.Error.ValidationError
const { validateLogin } = require("./validationMiddleware")

// the amount of work it takes to hash, makes more secure
// +1 saltround doubles the time necessary, as specified in docs
// note the salt is stored in the hash
// this implementation just prevents pre-computed attacks
// which is actually pretty effective :)
// also, they said >= 10 for production environments, so here we go.

async function register(req, res) {
  console.log("got register route")

  const { email, pw1, pw2, discordId, avatar } = req.body
  console.log(req.body)

  // make sure all fields are passed in
  if (!(email && pw1 && pw2 && discordId && avatar)) {
    return applyStatusAndError(
      res,
      400,
      "Email and password are required",
      ERROR_TYPES.EXPECTED
    )
  }

  if (pw1 !== pw2) {
    return applyStatusAndError(
      res,
      400,
      "Passwords do not match",
      ERROR_TYPES.ERROR_TYPES
    )
  }

  if (pw1.length < 8) {
    return applyStatusAndError(
      res,
      400,
      "Passwords must be at least 8 characters",
      ERROR_TYPES.EXPECTED
    )
  }

  // checks if user with email or discord already exists
  if (await User.findOne({ email: email.trim().toLowerCase() })) {
    return applyStatusAndError(
      res,
      400,
      `A user with email [${email.trim()}] already exists`,
      ERROR_TYPES.EXPECTED
    )
  }

  if (await User.findOne({ discordId })) {
    return applyStatusAndError(
      res,
      400,
      `A user with this Discord account already exists`,
      ERROR_TYPES.EXPECTED
    )
  }

  // encrypt password
  const encrypted = await hash(pw1)

  const newUser = User({
    email,
    password: encrypted,
    discordId,
    avatar,
  })

  try {
    const response = await newUser.save()
    return res
      .status(201)
      .json({ ...response, message: `Registration successful` })
  } catch (e) {
    if (e instanceof ValidationError) {
      return applyStatusAndError(res, 400, e.message, ERROR_TYPES.EXPECTED)
    } else {
      return applyStatusAndError(
        res,
        400,
        "Unexpected error ocurred. Please contact an admin with ERROR 7826",
        ERROR_TYPES.EXPECTED
      )
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  // IF user by email doesn't exist, return error
  if (!user) {
    return applyStatusAndError(res, 404, "Login invalid", ERROR_TYPES.EXPECTED)
  }

  // validate the password
  if (!(await compare(password, user.password))) {
    return applyStatusAndError(res, 401, "Login invalid", ERROR_TYPES.EXPECTED)
  }

  const jwtPayload = {
    email: user.email,
    discordId: user.discordId,
    type: user.type,
    _id: user._id,
    consigner: user.consigner,
  }

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.ACCESS_TOKEN_SECRET
    //   {s
    //   expiresIn: "1hr",
    // }
  )
  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.REFRESH_TOKEN_SECRET
    // {
    //   expiresIn: "6hr",
    // }
  )
  user.refreshToken = refreshToken
  await user.save()
  res.status(200).json({ accessToken, refreshToken })
}

// async function refreshToken(req, res) {
//   const token = req.body.token;

//   if (!token) {
//     return applyStatusAndError(res, 401, "Missing access token for refresh");
//   }

//   else {

//   }
// }

function useRoutes(expressApp) {
  expressApp.post("/register", register)
  expressApp.post("/login", validateLogin, login)
  expressApp.get("/test", (req, res) => {
    return res.redirect("https://google.com")
  })
}

module.exports = useRoutes
