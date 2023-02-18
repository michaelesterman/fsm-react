import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// import { Subscriber } from "./models/Subscriber";
import {
  createSubscriber,
  getSubscriber,
  updateAgreement,
} from "./controllers/Subscriber";

const app = express();
const port = process.env.PORT || 3000;

// const mongoOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/newsletter"
);

// Parse JSON request bodies
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("This is the API. Next versions will add authorization.");
});

// Define an endpoint for subscribing to the newsletter
app.post("/api/subscribe", async (req, res) => {
  const { email, agreedToTerms } = req.body;

  if (!email || !agreedToTerms) {
    return res.status(400).send("Email and agreement are required.");
  }

  // Check if the email is already subscribed
  const subscriber = await getSubscriber(email);

  if (subscriber && subscriber.agreedToTerms) {
    return res.status(400).send("Email already subscribed.");
  }

  // Save the user object to the database, or update the confirmation if the user already exists
  if (agreedToTerms && subscriber && !subscriber.agreedToTerms) {
    updateAgreement(email, agreedToTerms);
    return res.status(200).send("User agreed to terms.");
  }

  createSubscriber(email, agreedToTerms);

  // Return a success response
  return res.status(200).send("Subscription successful.");
});

app.listen(port, () => {
  console.log(`🚀 Development API started at http://localhost:${port}`);
});
