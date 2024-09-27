# Twiller

Welcome to the Twitter Clone project! This application replicates essential features of Twitter, including audio tweeting, user authentication, and subscription plans using a payment gateway.

## Features

### 1. Google Authentication
- Users can sign up or log in using their phone number or Google account for easy and secure access.

### 2. Audio Upload Feature
- Users can record their voice and post it as a tweet.
- Before uploading audio, users must authenticate via an OTP sent to their email.
- **Audio Limitations:**
  - Maximum audio length: 5 minutes.
  - Maximum file size: 100 MB.
  - Users can only upload audio between 2 PM and 7 PM IST. Upload attempts outside this time will be denied.

### 3. Subscription Plans
- Users can choose from various subscription plans to tweet:
  - **Free Plan:** Allows one tweet.
  - **Bronze Plan:** ₹100/month for up to 3 tweets.
  - **Silver Plan:** ₹300/month for up to 5 tweets.
  - **Gold Plan:** ₹1000/month for unlimited tweets.
- After payment, an email is sent to the user with the invoice and plan details.
- Payment system is active only between 10 AM and 11 AM IST. Transactions attempted outside this window will be blocked.

## Installation

1. Clone the repository:
   ```bash
   git clone [<repository-url>](https://github.com/darshneesunderraj/twiller)
   cd twiller
