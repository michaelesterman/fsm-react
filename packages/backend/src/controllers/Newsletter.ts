import { Newsletter } from "../models/Newsletter";

// Ideally newsletters should be cached
// We're also not using cursor() here, because dataset should be small
export const getAllNewsletters = async () => {
  try {
    const newsletters = await Newsletter.find({});
    return newsletters;
  } catch (error) {
    console.error(error);
    return null;
  }
};
