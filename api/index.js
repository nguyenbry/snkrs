const connect = require('./server');

// sometimes the environment is not development on local, but it is always production when deployed
if (process.env.NODE_ENV !== "production") {
  console.log("Initializing ENV file");
  require('dotenv').config();
}
connect();
