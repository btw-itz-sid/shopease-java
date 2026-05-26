const logger = require('../utils/logger');

const notFound = (req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Postgres unique violation
  if (err.code === '23505') { statusCode = 409; message = 'A record with this value already exists.'; }
  // Postgres foreign key violation
  if (err.code === '23503') { statusCode = 400; message = 'Referenced record does not exist.'; }

  if (process.env.NODE_ENV !== 'production') logger.error(`${statusCode} — ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
