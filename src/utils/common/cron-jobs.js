const cron = require("node-cron");
const { BookingService } = require("../../services");

function scheduleCrons() {
  cron.schedule("*/5 * * * *", async () => {
    try {
      await BookingService.cancelExpiredBookings();
    } catch (error) {
      console.log(error);
    }
  });
}

module.exports = scheduleCrons;
