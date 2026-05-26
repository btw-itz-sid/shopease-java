const success = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, ...data });

const error = (res, message = 'Something went wrong', statusCode = 500) =>
  res.status(statusCode).json({ success: false, message });

const paginated = (res, data, pagination, message = 'Success') =>
  res.json({ success: true, message, data, pagination });

module.exports = { success, error, paginated };
