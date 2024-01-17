const { BookingService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");

async function createBooking(req, res) {
  try {
    const data = {
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    };

    const booking = await BookingService.createBooking(data);
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function makePayment(req, res) {
  try {
    const data = {
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      totalCost: req.body.totalCost,
    };

    await BookingService.makePayment(data);
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createBooking,
  makePayment,
};
