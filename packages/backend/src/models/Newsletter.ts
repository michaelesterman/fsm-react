import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isChecked: { type: Boolean },
});

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
