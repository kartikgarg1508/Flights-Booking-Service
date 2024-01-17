const axios = require("axios");
const db = require("../models");
const { BookingRepository } = require("../repositories");
const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");
const { ServerConfig } = require("../config");

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

module.exports = {
  createBooking,
};
