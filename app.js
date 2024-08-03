// packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// imports
const auth = require("./routers/auth");
const tajweed = require("./routers/tajweed");
const prayerTimes = require("./routers/prayerTimes");
const audio = require("./routers/audio");
const authJwt = require("./middlewares/jwt");

// init
const app = express();
const port = process.env.PORT;
const url = process.env.API_URL;

//middlewares
app.use(cors());
app.options("*", cors());
app.use(express.json());
// app.use(authJwt);

// routers
app.use(`${url}/auth`, auth);
app.use(`${url}/tajweed`, tajweed);
app.use(`${url}/prayerTimes`, prayerTimes);
app.use(`${url}/audio`, audio);
app.use(`/:error`, (req, res) => {
  const { error } = req.params;
  res.send(`hi from error:- you write ${error} and there is no api like this`);
});

//connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connection successfully");
  })
  .catch((err) => {
    console.log(err);
    console.log(process.env.CONNECTION_STRING);
  });
app.listen(port, console.log(`server is listen in port:${port}`));

// hi me
