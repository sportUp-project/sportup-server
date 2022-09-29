const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    image: String,
    description: String,    
    sports: [{ type: Schema.Types.ObjectId, ref: 'Sport' }],
    userActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    joinedActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }]
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
