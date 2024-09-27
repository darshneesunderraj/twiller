import React, { useState } from "react";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../context/firebase"; // Import your Firebase auth setup

const actionCodeSettings = {
  url: 'http://localhost:3000', // Adjust to your app's domain or production URL
  handleCodeInApp: true,
};

const Authentication = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handle email submission to generate and send OTP
  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      // Simulate sending OTP here (replace with actual OTP generation and email sending logic)
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Example: Generate a random 6-digit OTP
      console.log('Generated OTP:', generatedOtp); // For demo purposes; remove in production

      // Send OTP to user's email (replace this with actual email-sending logic)
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('generatedOtp', generatedOtp); // Store OTP locally (for demo)
      setOtpSent(true);
      setMessage('OTP sent to your email. Please enter it below.');
      setError('');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Error sending OTP. Please try again.');
    }
  };

  // Handle OTP verification
  const handleOtpVerification = () => {
    const storedOtp = window.localStorage.getItem('generatedOtp'); // Retrieve OTP stored locally (for demo)
    if (otp === storedOtp) {
      setMessage('Successfully authenticated.');
      setIsVerified(true);
      window.localStorage.removeItem('generatedOtp'); // Clear stored OTP
      if (onSuccess) onSuccess(); // Trigger success callback
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div>
      <h2>Authenticate</h2>

      {/* Step 1: Enter email and send OTP */}
      {!otpSent && !isVerified && (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={handleEmailSubmit} style={{ padding: '8px 16px' }}>Send OTP</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}

      {/* Step 2: Enter OTP for verification */}
      {otpSent && !isVerified && (
        <div>
          <p>OTP sent to your email. Please enter the OTP below:</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={{ padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={handleOtpVerification} style={{ padding: '8px 16px' }}>Verify OTP</button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
      )}

      {/* Step 3: Success message after verification */}
      {isVerified && (
        <div>
          <p>{message}</p>
        </div>
      )}

      {/* Display general messages */}
      {message && !isVerified && <p>{message}</p>}
    </div>
  );
};

export default Authentication;
