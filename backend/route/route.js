const express = require("express");
const router = express.Router();
const protectPg = require("../utility/protectpg");
const { adminPanel } = require("../controller/controlle");
const {
  sendNotifications,
  disablePromotion,
  togglePromoCodeFeature,
  updateDistances
} = require("../controller/notificationcontroller");

router.get("/admin", adminPanel);

router.post("/send-notifications", sendNotifications);
router.post("/disable-promotion", disablePromotion);
router.post('/update-distances', updateDistances);
router.post("/togglePromoCodeFeature", togglePromoCodeFeature);


module.exports = router;
