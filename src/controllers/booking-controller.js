const { BookingService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/errors");

const inMemDB = {};

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
    const idempotencyKey = req.headers["x-idempotency-key"];
    if (!idempotencyKey) {
      throw new AppError("Idempotency Key Missing", StatusCodes.BAD_REQUEST);
    }

    if (inMemDB.idempotencyKey) {
      throw new AppError(
        "Cannot Retry a Successfull Payment",
        StatusCodes.BAD_REQUEST
      );
    }
    const data = {
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      totalCost: req.body.totalCost,
    };

    inMemDB.idempotencyKey = idempotencyKey;

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
