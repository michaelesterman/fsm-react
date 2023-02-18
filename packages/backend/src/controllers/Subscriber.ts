import { Subscriber } from "../models/Subscriber";

export const createSubscriber = async (
  email: string,
  agreedToTerms: boolean
) => {
  try {
    const newSubscriber = new Subscriber({ email, agreedToTerms });
    await newSubscriber.save();
    return newSubscriber;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getSubscriber = async (email: string) => {
  try {
    const subscriber = await Subscriber.findOne({ email });
    return subscriber;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateAgreement = async (
  email: string,
  agreedToTerms: boolean
) => {
  try {
    return Subscriber.findOneAndUpdate({ email: email }, { agreedToTerms });
  } catch (error) {
    console.error(error);
    return null;
  }
};
