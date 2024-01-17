const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");

async function validateCreateBooking(req, res, next) {
  if (req.body.flightId && req.body.userId && req.body.noOfSeats) {
    next();
  } else {
    ErrorResponse.message = "Something went wrong while creating the booking";
    let explanation = [];
    if (!req.body.flightId) {
      explanation.push(
        "flightId not found in the correct form in the incoming request"
      );
    }

    if (!req.body.userId) {
      explanation.push(
        "userId not found in the correct form in the incoming request"
      );
    }

    if (!req.body.noOfSeats) {
      explanation.push(
        "Number of Seats (noOfSeats) not found in the correct form in the incoming request"
      );
    }

    ErrorResponse.error = new AppError(explanation, StatusCodes.BAD_REQUEST);
    return res.status(ErrorResponse.error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  validateCreateBooking,
};
