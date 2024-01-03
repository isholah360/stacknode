require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const PORT = process.env.PORT || 5000;
const Alexa = require("ask-sdk-core");
const router = require("./route/route");

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(cors());
app.use("/nizams", require("./nizams"));
app.use("/keventers", require("./keventers"));
app.use("/api", router)
// app.get("/", (req, res) => {
//   res.json("this is kevenetersdashboard");
// });
app.get("/new", (req, res) => {
  res.json("this is nizamsdashbaord");
});
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speechText = "Welcome to your SDK weather skill. Ask me the weather!";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(
        "Welcome to your SDK weather skill. Ask me the weather!",
        speechText
      )
      .getResponse();
  },
};
const AskWeatherIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AskWeatherIntent"
    );
  },
  handle(handlerInput) {
    const speechText = "The weather today is sunny.";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard("The weather today is sunny.", speechText)
      .getResponse();
  },
};

// app.post("/keventers", async (req, res) => {
//   try {
//     // Getting data from client
//     let { amount, name } = req.body;
//     // Simple validation
//     if (!amount || !name)
//       return res.status(400).json({ message: "All fields are required" });
//     amount = parseInt(amount);
//     // Initiate payment
//     const paymentIntent = await keventers.paymentIntents.create({
//       amount: Math.round(amount * 100),
//       currency: "usd",
//       payment_method_types: ["card"],
//       metadata: { name },
//     });
//     // Extracting the client secret
//     const clientSecret = paymentIntent.client_secret;
//     // Sending the client secret as response
//     res.json({ message: "Payment initiated", clientSecret });
//   } catch (err) {
//     // Catch any error and send error 500 to client
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
//future payment

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
