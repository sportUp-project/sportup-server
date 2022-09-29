const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    image: String,
    description: String,    
    sports: [],
    userActivities: [],
    joinedActivities: []
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
