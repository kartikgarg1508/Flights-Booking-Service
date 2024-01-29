const express = require("express");
const { ServerConfig, LoggerConfig, QueueConfig } = require("./config");
const app = express();
const apiRoutes = require("./routes");

const CRONS = require("./utils/common/cron-jobs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Server started successfully at Port : ${ServerConfig.PORT}`);
  LoggerConfig.info("Successfully started server", {});
  CRONS();
  try {
    await QueueConfig.connectQueue();
  } catch (error) {
    console.log("Connection to Notification Queue cannot be established");
  }
});
