const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordcomplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
  },
  {
    versionKey: false,
  }
);
const validate = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(10).required(),
    email: Joi.string().email().required(),
    password: passwordcomplexity().required(),
    role: Joi.string().valid("user", "admin"),
  });
  return schema.validate(user);
};
const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validate,
};
