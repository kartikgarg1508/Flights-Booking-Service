const axios = require("axios");
const db = require("../models");
const { BookingRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../config");
const { Enums } = require("../utils/common");

const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const bookingrepository = new BookingRepository();

async function createBooking(data) {
  const t = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );

    const flightDetails = flight.data.data;
    if (flightDetails.totalAvailableSeats < data.noOfSeats)
      throw new AppError("Available Seats less", StatusCodes.BAD_REQUEST);

    data.totalCost = flightDetails.price * data.noOfSeats;
    const booking = await bookingrepository.create(data, t);

    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        noOfSeats: data.noOfSeats,
      }
    );

    await t.commit();
    return booking;
  } catch (error) {
    await t.rollback();

    if (error.statusCode === StatusCodes.BAD_REQUEST)
      throw new AppError(
        "Number of Available Seats is less than the requested number of seats to be booked",
        error.statusCode
      );

    throw new AppError(
      "Something went wrong while creating the booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  let explanation = [];
  try {
    const bookingDetails = await bookingrepository.get(data.bookingId);

    if (
      bookingDetails.userId != data.userId ||
      bookingDetails.totalCost != data.totalCost
    ) {
      if (bookingDetails.userId != data.userId)
        explanation.push("UserId does not match with that of Booking");
      if (bookingDetails.totalCost != data.totalCost)
        explanation.push("Total Cost does not match with that of Booking");

      throw new AppError("Details not match", StatusCodes.BAD_REQUEST);
    }

    // payment successfull assumed
    await bookingrepository.updateBookingStaus(
      data.bookingId,
      {
        status: BOOKED,
      },
      transaction
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    if (error.statusCode === StatusCodes.BAD_REQUEST)
      throw new AppError(explanation, error.statusCode);

    if (error.statusCode === StatusCodes.NOT_FOUND)
      throw new AppError(
        "There is no booking with given bookingId",
        error.statusCode
      );

    throw new AppError(
      "Something went wrong while making the payment",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createBooking,
  makePayment,
};
