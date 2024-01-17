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

router.post('/',BookingMiddleware.validateCreateBooking,BookingController.createBooking);


module.exports = router;
