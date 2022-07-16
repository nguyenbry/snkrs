const { createModel, createRef } = require("./createModel")

module.exports = createModel(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email) => email?.includes("@"),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    discordId: {
      type: String,
      required: [
        true,
        "Invalid Discord ID. This error indicateds an application bug and should not be happening. Please contact an admin to resolve.",
      ],
      validate: {
        validator: (id) => id.length === 18,
        message: () =>
          "Invalid Discord ID. This error indicateds an application bug and should not be happening. Please contact an admin to resolve.",
      },
    },
    avatar: {
      type: String,
      required: [
        true,
        "Invalid Discord avatar. This error indicateds an application bug and should not be happening. Please contact an admin to resolve.",
      ],
      validate: {
        validator: () => true,
        message: () =>
          "Invalid Discord avatar. This error indicates an application bug and should not be happening. Please contact an admin to resolve.",
      },
    },
    refreshToken: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    consigner: createRef("consigner"),
  },
  "user"
)
