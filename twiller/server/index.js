// Import required modules
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // For generating secure OTPs
const stripe = require('stripe')('sk_test_51Q1aZxRso3uz1PlMbmB3OhNUVAAYcQik2Ynzi55ju7vT8LjFxRhHIcSVdlv3LbPNsn8tp7y03Py7kraqAQuoLgi300hqJCfs7J'); // Replace with your actual Stripe secret key
const app = express();
const bodyParser = require('body-parser');

const uri = "mongodb+srv://d4rshh:residents31@cluster0.ms226i3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const port = 5000;

// Initialize MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Set up CORS and body parser
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());

// SMTP.js email configuration
const smtpCredentials = {
  SecureToken: "9df4e080-7d5e-4306-b147-0e62ab2a98b5", // Replace with your actual SMTP.js token
  From: "twiller@gmail.com", // Replace with your sender email
};

// Connect to MongoDB and handle routes
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const userCollection = client.db("X-Twiller").collection("Twiller");

    // API to handle user signup and send OTP
    app.post("/signup", async (req, res) => {
      const { email } = req.body;
      const otp = crypto.randomInt(1000, 9999); // Generate 4-digit OTP

      try {
        const user = { email, otp, isVerified: false };
        await userCollection.insertOne(user);

        // Send OTP to user's email
        const emailBody = `<h2>Your OTP is: ${otp}</h2>`;
        Email.send({
          SecureToken: smtpCredentials.SecureToken,
          To: email,
          From: smtpCredentials.From,
          Subject: "Your OTP for Twiller Signup",
          Body: emailBody,
        }).then((message) => {
          if (message === "OK") {
            res.status(201).json({ message: "OTP sent to your email" });
          } else {
            res.status(500).json({ message: "Error sending OTP" });
          }
        });
      } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Failed to register user" });
      }
    });

    // API to verify OTP
    app.post("/verify-otp", async (req, res) => {
      const { email, otp } = req.body;

      try {
        const user = await userCollection.findOne({ email, otp: parseInt(otp) });

        if (user) {
          await userCollection.updateOne({ email }, { $set: { isVerified: true } });
          res.status(200).json({ message: "Email verified successfully" });
        } else {
          res.status(400).json({ message: "Invalid OTP" });
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ message: "Error verifying OTP" });
      }
    });

    // API to handle post creation
    app.post('/post', (req, res) => {
      try {
        const { post, photo, email } = req.body;
        if (!post || !email) {
          return res.status(400).json({ error: 'Post content or email is missing' });
        }
        console.log('Post received:', req.body);  // Log request details
        return res.status(200).json({ message: 'Post created successfully' });
      } catch (error) {
        console.error('Error processing post:', error);  // Log error details
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.options('/post', cors()); // Handle preflight request for /post route

    // Create a Stripe Checkout Session
    app.post('/create-checkout-session', async (req, res) => {
      const { planType, email } = req.body;

      let priceId = '';
      switch (planType) {
        case 'TestCase':
          priceId = 'prod_QtNkJBB5QhtjrU'; // Replace with your actual Stripe price ID for Bronze Plan
          break;
        case 'bronze':
          priceId = 'prod_QtNloSzSkLyeSW'; // Replace with your actual Stripe price ID for Bronze Plan
          break;
        case 'silver':
          priceId = 'prod_QtNon9X3ogIZ5l'; // Replace with your actual Stripe price ID for Silver Plan
          break;
        case 'gold':
          priceId = 'prod_QtNpnYJaWAdeJw'; // Replace with your actual Stripe price ID for Gold Plan
          break;
        default:
          res.status(400).json({ message: "Invalid plan type selected" });
          return;
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          customer_email: email, // Automatically creates a customer in Stripe
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel',
        });

        res.status(200).json({ id: session.id });
      } catch (error) {
        console.error("Stripe error:", error);
        res.status(500).json({ message: "Failed to create checkout session" });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);
