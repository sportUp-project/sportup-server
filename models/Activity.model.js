const { Schema, model, default: mongoose } = require("mongoose");


const activitySchema = new Schema(
  {
    name: { type: String, required: true }, 
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sport: { type: Schema.Types.ObjectId, ref: 'Sport' },
    description: String,
    duration: String,
    activityDate: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    location: {},
    pictures:  [{ type: String}]
  },
  {
    timestamps: true,
  }
);

const activity = model("Activity", activitySchema);

module.exports = activity;
