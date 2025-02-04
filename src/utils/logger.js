const { createLogger, format, transports } = require("winston");
const LokiTransport = require("winston-loki");

const logger = createLogger({
  level: "info",
  format: format.json(),
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100", // Loki server
      labels: { app: "nextjs" }, // Optional labels
      json: true,
      timeout: 5000,
      format: format.json(),
    }),
  ],
});

module.exports = logger;
