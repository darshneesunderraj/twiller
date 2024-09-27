import React, { useState } from "react";
import { Link } from "react-router-dom";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../../context/UserAuthContext";
import "./login.css";

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, googleSignIn } = useUserAuth();
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert('Sign up successful!');
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Sign up failed!');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      alert('Google sign-in successful!');
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Google sign-in failed!');
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img className="image" src={twitterimg} alt="Twitter" />
        </div>

        <div className="form-container">
          <div>
            <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
            <h2 className="heading">Happening now</h2>
            <div className="d-flex align-items-sm-center">
              <h3 className="heading1">Join Twiller today</h3>
            </div>
            {error && <p className="errorMessage">{error}</p>}
            <form onSubmit={handleSignup}>
              <input
                className="email"
                type="email"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                className="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <div className="btn-login">
                <button type="submit" className="btn">
                  Sign Up
                </button>
              </div>
            </form>
            <hr />
            <div className="google-button">
              <GoogleButton
                className="g-btn"
                type="light"
                onClick={handleGoogleSignIn}
              />
            </div>
            <div>
              Already have an account?
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "var(--twitter-color)",
                  fontWeight: "600",
                  marginLeft: "5px",
                }}
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
