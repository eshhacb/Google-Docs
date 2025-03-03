import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  _id: String,
  content: String,
  history: [
    {
      type: { type: String, enum: ["insert", "delete"] },
      index: Number,
      text: String,
      length: Number,
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Document", documentSchema);
