const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const useRoutes = require("./routes/authRoutes")
const useItemRoutes = require("./routes/itemRoutes")
const useConsignerRoutes = require("./routes/consignerRoutes")

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
console.log("using routes")

// apply all routes
useRoutes(app)
useItemRoutes(app)
useConsignerRoutes(app)

const PORT = process.env.PORT || 4000
const connect = () => {
  return mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port: [${PORT}]`)
      })
      return app
    })
}

module.exports = connect
