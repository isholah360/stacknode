const admin = require('firebase-admin');
const uuid = require('uuid');
// Initializing Firebase Admin SDK
const serviceAccount = require('../serviceKey.json');
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore collections
const promotionsCollection = admin.firestore().collection('promotions');
const usersCollection = admin.firestore().collection('users');
const usedPromotionsCollection = admin.firestore().collection('usedPromotions');

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}
function generatePromoCode() {
  const uuid = uuid.v4();
  return uuid.substr(0, 6).toUpperCase();
}

// API endpoint to send notifications to users within the specified range
async function sendNotifications(req, res) {
    try {
      const { userId, latitude, longitude } = req.body;
  
      const usersCollection = admin.firestore().collection('users');
      const promotionsCollection = admin.firestore().collection('promotions');
  
      // Generate a promotional code
      const promotionalCode = generatePromoCode();
      
      // Check if the user already has an active code
      const userDoc = await usersCollection.doc(userId).get();
      if (userDoc.exists && userDoc.data().activeCode) {
        return res.json({ message: 'User already has an active code' });
      }
  
      // Retrieve the promotional location from Firestore
      const promoDoc = await promotionsCollection.doc('promo1').get();
      const promoLocation = promoDoc.data().location;
  
      // Calculate the distance between the user and the promotional location
      const userDistance = calculateDistance(latitude, longitude, promoLocation.latitude, promoLocation.longitude);
  
      // Checking if the user is within the specified range (5-7 km) and does not have an active code
      if (userDistance >= 5 && userDistance <= 7 && !userDoc.data().activeCode) {
        // Querying users within the range from Firestore
        const usersInRangeSnapshot = await usersCollection
          .where('latitude', '>=', promoLocation.latitude - 0.05) // Adjust the range based on your requirements
          .where('latitude', '<=', promoLocation.latitude + 0.05)
          .where('longitude', '>=', promoLocation.longitude - 0.05)
          .where('longitude', '<=', promoLocation.longitude + 0.05)
          .get();
  
        // Extracting user IDs from the query snapshot
        const usersInRange = usersInRangeSnapshot.docs.map((doc) => doc.id);
  
        // Sending notifications only to users within the range and without an active code
        const notifications = usersInRange.map((user) => ({
          userId: user,
          message: `New promotion! Use code ${promotionalCode}`,
        }));
  
        // Saving the active code for the user
        await usersCollection.doc(userId).set({ activeCode: promotionalCode });
  
        return res.json({ message: 'Notifications sent successfully', notifications });
      }
    } catch (error) {
      console.error('Error sending notifications:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

// API endpoint to disable a promotional code after a user has accepted it
async function disablePromotion(req, res) {
    try {
      const { userId, promotionalCode } = req.body;
  
      const usersCollection = admin.firestore().collection('users');
      const usedPromotionsCollection = admin.firestore().collection('usedPromotions');
  
      // Check if the user exists and has the provided promotional code as an active code
      const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists || userDoc.data().activeCode !== promotionalCode) {
      return res.status(400).json({ message: 'Invalid request. User or promotional code not found.' });
    }

    // Implement additional logic to mark the code as used in another collection
    const usedPromotionData = {
      userId: userId,
      promotionalCode: promotionalCode,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save the used promotion data to the 'usedPromotions' collection
    await usedPromotionsCollection.add(usedPromotionData);

    // Clear the active code for the user
    await usersCollection.doc(userId).update({ activeCode: null });

    return res.json({ message: 'Promotion disabled successfully' });
  } catch (error) {
    console.error('Error disabling promotion:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
  
  module.exports = { sendNotifications, disablePromotion };
