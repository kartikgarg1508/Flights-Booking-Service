const CrudRepository = require("./crud-repository");
const { Booking } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { AppError } = require("../utils/errors");

const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const { Op } = require("sequelize");
class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async create(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }

  async updateBookingStaus(id, data, transaction) {
    // data : { col1 : value, ...}

    const response = await Booking.update(data, {
      where: {
        id: id,
      },
      transaction: transaction,
    });

    // if id not found :

    if (response[0] == 0) {
      throw new AppError(
        "The resource you requested was not found",
        StatusCodes.NOT_FOUND
      );
    }
  }

  async getAllExpired(timestamp) {
    const response = await Booking.findAll({
      where: {
        [Op.and]: [
          { status: { [Op.ne]: BOOKED } },
          { status: { [Op.ne]: CANCELLED } },
          { createdAt: { [Op.lte]: timestamp } },
        ],
      },
      attributes: ["id"],
    });
    return response;
  }
}

module.exports = BookingRepository;
