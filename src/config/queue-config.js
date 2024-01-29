const ServerConfig = require("./server-config");
const amqplib = require("amqplib");

let connection, channel;

async function connectQueue() {
  try {
    connection = await amqplib.connect(ServerConfig.RABBITMQ_SERVER);
    channel = await connection.createChannel();

    await channel.assertQueue("Notification-queue");
  } catch (error) {
    throw error;
  }
}

async function publishToQueue(data) {
  try {
    channel.sendToQueue(
      "Notification-queue",
      Buffer.from(JSON.stringify(data))
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  connectQueue,
  publishToQueue,
};
