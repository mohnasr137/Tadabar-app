const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  email: {
    require: true,
    type: String,
    trim: true,
  },
  password: {
    require: true,
    type: String,
  },
  type: {
    type: String,
    default: "user",
  },
  resetPass: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
