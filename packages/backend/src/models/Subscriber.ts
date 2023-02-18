import mongoose from "mongoose";

// Define a schema for the user and confirmation objects
const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  agreedToTerms: { type: Boolean, required: true },
  confirmed: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

const agreementSchema = new mongoose.Schema({
  email: { type: String, required: true },
  agreedToTerms: { type: Boolean, required: true },
});

// Create models for the user and confirmation objects
export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export const Agreement = mongoose.model("Agreement", agreementSchema);
