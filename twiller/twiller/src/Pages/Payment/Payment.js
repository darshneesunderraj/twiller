// Payment.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const { planType } = location.state || {};
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const createCheckoutSession = async () => {
      try {
        const response = await axios.post('http://localhost:5000/create-checkout-session', {
          planType,
          email: 'sdarshu31@gmail.com', // Replace with actual user email
        });
        setSessionId(response.data.id);
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    };

    if (planType) {
      createCheckoutSession();
    }
  }, [planType]);

  const handlePayment = () => {
    if (sessionId) {
      const stripe = window.Stripe('pk_test_51Q1aZxRso3uz1PlMMskMNCVNpKWvlyaPQTbyAWYVQhWMXn3YltisTM5afC4MA1d9Bjekh1rAGUMtX8SHglLMr0B500dyYLc5LC'); // Replace with your Stripe publishable key
      stripe.redirectToCheckout({ sessionId });
    }
  };

  return (
    <div>
      <h2>Payment for {planType}</h2>
      <button onClick={handlePayment}>Proceed to Payment</button>
    </div>
  );
};

export default Payment;
