// packages
const express = require("express");

// imports
const { signUp, signIn } = require("../controllers/auth/basicAuth");
const {
  sendPassEmail,
  activeResetPass,
  resetPassword,
} = require("../controllers/auth/resetPassword");

// init
const authRouter = express.Router();
const url = process.env.API_URL;

// routers
authRouter.post("/signUp", signUp);
authRouter.post("/signIn", signIn);
authRouter.post("/sendPassEmail", sendPassEmail);
authRouter.post("/activeResetPass", activeResetPass);
authRouter.post("/resetPassword", resetPassword);

module.exports = authRouter;
