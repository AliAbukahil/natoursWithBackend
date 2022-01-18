// /* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51KG1zECMxSvGV20d0rsVEy8SyZF41hXRZ4XdFUr54ZIoFKJHYmnjwYQdhgskT3pPsV7AREqfdqiA5JKBCBzN93J200AVJCkwxL'
);

export const bookTour = async (tourId) => {
  try {
    // 1) get session for the API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) using Stripe Creaate checkout form + chance credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
