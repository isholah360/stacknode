const { admin } = require("../firebase");
const uuid = require("uuid");

// Firestore collections
const promotionsCollection = admin.firestore().collection("promotions");
const usersCollection = admin.firestore().collection("users");
const usedPromotionsCollection = admin.firestore().collection("usedPromotions");

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function generatePromoCode() {
  const newUuid = uuid.v4();
  return newUuid.substr(0, 6).toUpperCase();
}

let promoCodeFeatureEnabled = false;

// Function to update distances globally
async function updateDistances(req, res) {
  try {
    // Extract minDistance and maxDistance from the request body
    const { minDistance, maxDistance } = req.body;

    // Store minDistance and maxDistance in a global variable 
    global.minDistance = parseFloat(minDistance);
    global.maxDistance = parseFloat(maxDistance);

    return res.json({ message: 'Distances updated successfully' });
  } catch (error) {
    console.error('Error updating distances:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// API endpoint to send notifications to users within the specified range
async function sendNotifications(req, res) {
  try {
    if (!promoCodeFeatureEnabled) {
      return res.json({ message: "Promo code feature is currently disabled" });
    }

    const { userId, latitude, longitude } = req.body;

    // Check if minDistance and maxDistance are defined
    if (typeof global.minDistance !== 'undefined' && typeof global.maxDistance !== 'undefined') {
      const promotionalCode = generatePromoCode();

      const userDoc = await usersCollection.doc(userId).get();
      if (userDoc.exists && userDoc.data().activeCode) {
        return res.json({ message: "User already has an active code" });
      }

      const promoDoc = await promotionsCollection.doc("promo1").get();
      const promoLocation = promoDoc.data().location;

      const userDistance = calculateDistance(
        latitude,
        longitude,
        promoLocation.latitude,
        promoLocation.longitude
      );

      // Use global.minDistance and global.maxDistance here
      if (
        userDistance >= global.minDistance &&
        userDistance <= global.maxDistance &&
        !userDoc.data().activeCode
      ) {
        const usersInRangeSnapshot = await usersCollection
          .where("latitude", ">=", promoLocation.latitude - 0.05)
          .where("latitude", "<=", promoLocation.latitude + 0.05)
          .where("longitude", ">=", promoLocation.longitude - 0.05)
          .where("longitude", "<=", promoLocation.longitude + 0.05)
          .get();

        const usersInRange = usersInRangeSnapshot.docs.map((doc) => doc.id);

        const notifications = usersInRange.map((user) => ({
          userId: user,
          message: `New promotion! Use code ${promotionalCode}`,
        }));

        await usersCollection.doc(userId).set({ activeCode: promotionalCode });

        return res.json({
          message: "Notifications sent successfully",
          notifications,
        });
      } else {
        // Handle case where user is outside the specified distance range
        return res.json({ message: "User is outside the specified distance range" });
      }
    } else {
      // Handle case where minDistance or maxDistance is not defined
      return res.status(500).json({ error: 'Distances not defined' });
    }
  } catch (error) {
    console.error("Error sending notifications:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}


// API endpoint to disable a promotional code after a user has accepted it
async function disablePromotion(req, res) {
  try {
    if (!promoCodeFeatureEnabled) {
      return res.json({ message: "Promo code feature is currently disabled" });
    }

    const { userId, promotionalCode } = req.body;

    const userDoc = await usersCollection.doc(userId).get();

    if (!userDoc.exists || userDoc.data().activeCode !== promotionalCode) {
      return res.status(400).json({
        message: "Invalid request. User or promotional code not found.",
      });
    }

    const usedPromotionData = {
      userId: userId,
      promotionalCode: promotionalCode,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await usedPromotionsCollection.add(usedPromotionData);

    await usersCollection.doc(userId).update({ activeCode: null });

    return res.json({ message: "Promotion disabled successfully" });
  } catch (error) {
    console.error("Error disabling promotion:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Function to toggle the promo code feature globally
async function togglePromoCodeFeature(req, res) {
  try {
    promoCodeFeatureEnabled = !promoCodeFeatureEnabled;
    return res.json({ status: promoCodeFeatureEnabled });
  } catch (error) {
    console.error('Error toggling promo code feature:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  sendNotifications,
  disablePromotion,
  togglePromoCodeFeature,
  updateDistances,
};
