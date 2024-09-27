import React from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure this import is added
import collect from 'collect.js';

const SubscriptionPlans = () => {
  const navigate = useNavigate(); // Now the navigate function is defined

  const handlePlanClick = async (planType) => {
    const planDetails = {
      bronze: { amount: 100, planName: 'Bronze Plan' },
      silver: { amount: 300, planName: 'Silver Plan' },
      gold: { amount: 1000, planName: 'Gold Plan' },
    };

    const selectedPlan = planDetails[planType];

    // Open the payment gateway using Collect.js
    const response = await collect({
      amount: selectedPlan.amount,
      planName: selectedPlan.planName,
      currency: 'INR',
      // Add other necessary parameters as per Collect.js documentation
    });

    if (response && response.success) {
      // Handle successful payment
      console.log('Payment successful:', response);
      navigate('/success'); // Redirect or handle success
    } else {
      // Handle payment failure
      console.error('Payment failed:', response);
    }
  };

  return (
    <div className="subscriptionPlans">
      <h2>Select a Subscription Plan</h2>
      <div className="plan" onClick={() => handlePlanClick('bronze')}>
        <h3>Bronze Plan</h3>
        <p>₹100/month for 3 tweets</p>
      </div>
      <div className="plan" onClick={() => handlePlanClick('silver')}>
        <h3>Silver Plan</h3>
        <p>₹300/month for 5 tweets</p>
      </div>
      <div className="plan" onClick={() => handlePlanClick('gold')}>
        <h3>Gold Plan</h3>
        <p>₹1000/month for unlimited tweets</p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
