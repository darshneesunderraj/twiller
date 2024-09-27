import React, { useState } from 'react';
import { Avatar, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useUserAuth } from '../../../context/UserAuthContext';
import { loadStripe } from '@stripe/stripe-js'; 
import './Tweetbox.css';

const stripePromise = loadStripe('pk_test_51Q1aZxRso3uz1PlMMskMNCVNpKWvlyaPQTbyAWYVQhWMXn3YltisTM5afC4MA1d9Bjekh1rAGUMtX8SHglLMr0B500dyYLc5LC'); // Replace with your actual publishable key

const Tweetbox = () => {
  const [post, setPost] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('');
  const { user } = useUserAuth();

  const userProfilePic = user?.photoURL || 'default-profile-pic-url'; 
  const email = user?.email;

  const handlePayment = async () => {
    const planDetails = {
      free: { priceId: 'prod_QtNkJBB5QhtjrU', planName: 'Free Plan' },
      bronze: { priceId: 'prod_QtNloSzSkLyeSW', planName: 'Bronze Plan' },
      silver: { priceId: 'prod_QtNon9X3ogIZ5l', planName: 'Silver Plan' },
      gold: { priceId: 'prod_QtNpnYJaWAdeJw', planName: 'Gold Plan' },
    };

    const selectedPlan = planDetails[subscriptionPlan];
    const stripe = await stripePromise;

    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId, 
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error('Error during payment:', result.error.message);
      }
    } catch (error) {
      console.error('Error creating Stripe session:', error);
    }
  };

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar src={userProfilePic} />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
          />
        </div>
        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon">
            <p>{imageUrl ? 'Image Uploaded' : <AddPhotoAlternateOutlinedIcon />}</p>
          </label>
          <input type="file" id="image" className="imageInput" />
          <Button className="tweetBox__tweetButton" type="submit">
            Tweet
          </Button>
        </div>
      </form>

      <FormControl variant="outlined" fullWidth>
        <InputLabel id="subscription-plan-label">Select Plan</InputLabel>
        <Select
          labelId="subscription-plan-label"
          value={subscriptionPlan}
          onChange={(e) => setSubscriptionPlan(e.target.value)}
          label="Select Plan"
        >
          <MenuItem value="free">Free Plan</MenuItem>
          <MenuItem value="bronze">Bronze Plan</MenuItem>
          <MenuItem value="silver">Silver Plan</MenuItem>
          <MenuItem value="gold">Gold Plan</MenuItem>
        </Select>
      </FormControl>

      <Button
        className="tweetBox__paymentButton"
        onClick={handlePayment}
        disabled={!subscriptionPlan}
      >
        Subscribe
      </Button>
    </div>
  );
};

export default Tweetbox;
