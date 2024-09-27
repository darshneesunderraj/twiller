import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login/Login';
import Signup from './Pages/Login/Signup';
import Feed from './Pages/Feed/Feed';
import Explore from './Pages/Explore/Explore';
import Notification from './Pages/Notification/Notification';
import Message from './Pages/Messages/Message';
import ProtectedRoute from './Pages/ProtectedRoute';
import Lists from './Pages/Lists/Lists';
import Profile from './Pages/Profile/Profile';
import More from './Pages/more/More';
import Bookmark from './Pages/Bookmark/Bookmark';
import Auth from './Pages/Audio/Authentication';
import AudioRecorder from './Pages/Audio/AudioRecorder';
import Payment from './Pages/Payment/SubscriptionPlans'; // New Payment Component
import { UserAuthContextProvider } from './context/UserAuthContext';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false); // State for subscription status

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  const handleSubscriptionSuccess = () => {
    setSubscriptionActive(true);
  };

  return (
    <div className="app">
      <UserAuthContextProvider>
        <Routes>
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notification" element={<Notification />} />
            <Route path="messages" element={<Message />} />
            <Route path="lists" element={<Lists />} />
            <Route path="bookmarks" element={<Bookmark />} />
            <Route path="profile" element={<Profile />} />
            <Route path="more" element={<More />} />
          </Route>

          {/* Login and Signup Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Payment Route */}
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment onSuccess={handleSubscriptionSuccess} />
              </ProtectedRoute>
            } 
          />

          {/* Additional Routes */}
          <Route path="/auth" element={<Auth onSuccess={handleAuthSuccess} />} />
          <Route 
            path="/record" 
            element={
              subscriptionActive ? (
                authenticated ? <AudioRecorder /> : <Auth onSuccess={handleAuthSuccess} />
              ) : (
                <Payment onSuccess={handleSubscriptionSuccess} />
              )
            } 
          />
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
