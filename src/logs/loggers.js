const {LOG_VARS} = require("../config/logger_config.js");
const {AWS_CLOUDWATCH_VARS} = require("../config/aws_config.js");

const { createLogger, format, transports } = require("winston");
const WinstonCloudWatch = require("winston-cloudwatch");

// AWS CloudWatch configuration
const awsCloudWatchConfig = {
  ...AWS_CLOUDWATCH_VARS
};

//-------------------------- INFO LOGGER ---------------------------------------------
const infoLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    //Output to console in a human readable format
    new transports.Console({
      format: format.colorize()
    }),

    //Output to CloudWatch
    new WinstonCloudWatch({
      ...awsCloudWatchConfig,
      logGroupName: "/diffum-goals/Api/INFO",
      logStreamName: `info-${new Date().toISOString().split('T')[0]}`
    })
  ],
});

//-------------------------- ERROR LOGGER ---------------------------------------------

const errorLogger = createLogger({
  level: "error",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }) // captura stack si es Error
  ),
  transports: [
    
    //Output to console in a human readable format
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, stack, ...meta }) => {
          if (message instanceof Error) {
            return `[${timestamp}] ${level}: ${message.name} - ${message.message} ${JSON.stringify(meta)}\n${stack}`;
          }
          return `[${timestamp}] ${level}: ${message} ${JSON.stringify(meta)}`;
        })
      )
    }),

    //Output to CloudWatch in JSON format
    new WinstonCloudWatch({
      ...awsCloudWatchConfig,
      logGroupName: "/diffum-goals/Api/ERROR",
      logStreamName: `error-${new Date().toISOString().split('T')[0]}`,
      jsonMessage: true
    })
  ]
});




module.exports = {infoLogger, errorLogger};