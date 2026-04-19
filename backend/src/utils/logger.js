const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Simple logger class
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, 'app.log');
  }

  // Format log message with timestamp
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}\n`;
  }

  // Write to file
  writeToFile(message) {
    fs.appendFileSync(this.logFile, message);
  }

  // Log info level
  info(message, meta = {}) {
    const formattedMessage = this.formatMessage('info', message, meta);
    console.log(formattedMessage.trim());
    this.writeToFile(formattedMessage);
  }

  // Log error level
  error(message, meta = {}) {
    const formattedMessage = this.formatMessage('error', message, meta);
    console.error(formattedMessage.trim());
    this.writeToFile(formattedMessage);
  }

  // Log warning level
  warn(message, meta = {}) {
    const formattedMessage = this.formatMessage('warn', message, meta);
    console.warn(formattedMessage.trim());
    this.writeToFile(formattedMessage);
  }

  // Log debug level
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message, meta);
      console.debug(formattedMessage.trim());
      this.writeToFile(formattedMessage);
    }
  }
}

module.exports = new Logger();