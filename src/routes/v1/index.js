const express = require("express");
const router = express.Router();

const { infoController } = require("../../controllers");
const BookingRoutes = require("./booking-routes");

router.get("/info", infoController.info);
router.use("/bookings", BookingRoutes);

module.exports = router;
