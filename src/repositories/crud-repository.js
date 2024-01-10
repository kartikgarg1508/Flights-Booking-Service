const { AppError } = require("../utils/errors");
const { StatusCodes } = require("http-status-codes");

class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    const response = await this.model.create(data);
    return response;
  }

  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if (!response) {
      throw new AppError(
        "The resource you requested to delete was not found",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async get(data) {
    const response = await this.model.findByPk(data);
    if (!response) {
      throw new AppError(
        "The resource you requested was not found",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }

  async getAll(data) {
    const response = await this.model.findAll();
    return response;
  }

  async update(id, data) {
    // data : { col1 : value, ...}

    const response = await this.model.update(data, {
      where: {
        id: id,
      },
    });

    // if id not found :

    if (response[0] == 0) {
      throw new AppError(
        "The resource you requested was not found",
        StatusCodes.NOT_FOUND
      );
    }

    return response;
  }
}

module.exports = CrudRepository;
