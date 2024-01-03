const router = require("express").Router();
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

var serviceAccount = require("./serviceAccount.json");
// keventers-53ebe-firebase-adminsdk-u7w0p-09ad948083
initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://keventers-53ebe-default-rtdb.firebaseio.com",
});
// Initialize Firebase

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEVENTERS, {
  apiVersion: "2022-08-01",
});

router.post("/pay", async (request, response) => {
  try {
    let { amount, paymentMethodId, payment_intent_id } = request.body;

    let intent;
    if (paymentMethodId) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: paymentMethodId,
        amount: Math.round(amount * 100),
        currency: "cad",
        confirmation_method: "manual",
        confirm: true,
      });
    } else if (payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(payment_intent_id);
    }
    let getres = generateResponse(intent);

    // Send the response to the client
    return response.json(getres);
  } catch (e) {
    // Display error on client
    console.log(e);
    return response.json({ error: e.message });
  }
});

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  switch (intent.status) {
    case "requires_action":
    case "requires_source_action":
      // Card requires authentication
      return {
        requiresAction: true,
        clientSecret: intent.client_secret,
      };
    case "requires_payment_method":
    case "requires_source":
      // Card was not properly authenticated, suggest a new payment method
      return {
        error: "Your card was denied, please provide a new payment method",
      };
    case "succeeded":
      // Payment is complete, authentication not required
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
      console.log("💰 Payment received!");
      return { clientSecret: intent.client_secret };
  }
};

router.post("/create-payment-intent", async (req, res) => {
  try {
    // Getting data from client
    let { amount, name } = req.body;
    // Simple validation
    if (!amount || !name)
      return res.status(400).json({ message: "All fields are required" });
    amount = parseFloat(amount);

    // Initiate payment
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "cad",
      payment_method_types: ["card"],
      // metadata: { name },
    });
    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/future", async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-08-01" }
    );
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    res.json({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51Lhc7tFVFJYWYMVVNd7n6MwlqXH4jEaH7HW2AB55xLRS6fHGFAYa5VLjHOlvWP6KU9DNOQoPQmMe0niqxE1kzSWP00lXXKdxSk",
    });
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/duringpayment", async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const { amount, name } = req.body;
  amount = parseInt(amount);
  if (!amount || !name)
    return res.status(400).json({ message: "All fields are required" });
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-08-01" }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      customer: customer.id,
      setup_future_usage: true,
      payment_method_types: ["card"],
      metadata: { name },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51Lhc7tFVFJYWYMVVNd7n6MwlqXH4jEaH7HW2AB55xLRS6fHGFAYa5VLjHOlvWP6KU9DNOQoPQmMe0niqxE1kzSWP00lXXKdxSk",
    });
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/all", async (req, res) => {
  try {
    const { customer } = req.body;
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer,
      type: "card",
    });
    res.json({ paymentMethods });
  } catch (err) {
    // Catch any error and send error 500 to client

    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.post("/futuresession", async (req, res) => {
  try {
    const { amount, customerId, paymentId } = req.body;
    amount = parseInt(amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "cad",
      customer: customerId,
      payment_method: paymentId,
      off_session: true,
      confirm: true,
    });
    // Extracting the client secret
    const clientSecret = paymentIntent.client_secret;
    // Sending the client secret as response
    res.json({ message: "Payment initiated", clientSecret });
  } catch (err) {
    // Error code will be authentication_required if authentication is needed

    const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(
      err.raw.payment_intent.id
    );
    res.json({ message: "PI retrieved: ", data: paymentIntentRetrieved.id });
  }
});

router.post("/adduser", async (req, res) => {
  const { email, password } = req.body;
  getAuth()
    .createUser({
      email,
      password,
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.status(201).json({ uid: userRecord.uid });
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      res.json({ message: error?.message });
    });
});
module.exports = router;
