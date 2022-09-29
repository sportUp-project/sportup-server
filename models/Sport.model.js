const { Schema, model } = require("mongoose");

const sportSchema = new Schema(
  {
    name: { type: String, required: true }, 
    iconUrl: String,
    imageUrl: String,
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  },
  {
    timestamps: true,
  }
);

const sport = model("Sport", sportSchema);

module.exports = sport;