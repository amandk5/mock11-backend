const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = model("mock11user", userSchema);

module.exports = UserModel;
