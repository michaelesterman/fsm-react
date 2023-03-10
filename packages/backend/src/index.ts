import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import {
  createSubscriber,
  getSubscriber,
  updateAgreement,
} from "./controllers/Subscriber";

import { seedNewsletters } from "./utils/seeder";
import { getAllNewsletters } from "./controllers/Newsletter";

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/newsletter"
);

await seedNewsletters();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("This is the API. Next versions will add authorization.");
});

app.get("/api/newsletters", async (req: Request, res: Response) => {
  res.json(await getAllNewsletters());
});

// Define an endpoint for subscribing to the newsletter
app.post("/api/subscribe", async (req, res) => {
  console.log(req.body);

  const { email, agreedToTerms } = req.body;

  if (!email || !agreedToTerms) {
    return res.status(400).json({ error: "Email and agreement are required." });
  }

  // Check if the email is already subscribed
  const subscriber = await getSubscriber(email);

  if (subscriber && subscriber.agreedToTerms) {
    return res
      .status(400)
      .json({
        error: "You've already subscribed. We'll update your preferences.",
      });
  }

  // Save the user object to the database, or update the confirmation if the user already exists
  if (agreedToTerms && subscriber && !subscriber.agreedToTerms) {
    updateAgreement(email, agreedToTerms);
    return res.status(200).send("You've agreed to terms.");
  }

  createSubscriber(email, agreedToTerms);

  // Return a success response
  return res.status(200).send("Subscription successful.");
});

app.listen(port, () => {
  console.log(`🚀 Development API started at http://localhost:${port}`);
});
