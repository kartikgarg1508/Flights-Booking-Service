const express = require("express");
const { BookingController } = require("../../controllers");
const { BookingMiddleware } = require("../../middlewares");

const router = express.Router();
/*
POST: /api/v1/bookings
req-body 
{
    flightId: 1
    userId: 1
    noOfSeats: 5
}
*/

router.post(
  "/",
  BookingMiddleware.validateCreateBooking,
  BookingController.createBooking
);

/*
POST: /api/v1/bookings/payment
req-body 
{
    bookingId: 1
    userId: 1
    totalCost: 40000
}
*/

router.post(
  "/payment",
  BookingMiddleware.validatePayment,
  BookingController.makePayment
);

module.exports = router;
