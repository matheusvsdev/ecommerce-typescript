import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(), // Adiciona timestamp em cada log
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/api.log" }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }), // Log separado para erros
  ],
});

export default logger;
