import { Newsletter } from "../models/Newsletter";

export const seedNewsletters = async () => {
  const testNewsletters = [
    { title: "Bloomberg Weekly", isChecked: true },
    { title: "Markets News" },
    { title: "Media Digest" },
  ];

  try {
    const newsletters = await Newsletter.find({});

    if (newsletters.length === 0) {
      await Newsletter.insertMany(testNewsletters);
    }
  } catch (error) {
    console.error(error);
  }
};
