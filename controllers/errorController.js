const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name || err.keyValue.email;
  const message = `${value} is not availibe, please use an other one`
  return new AppError(message, 400)
}

const handleRequiredFieldsDB = err => {
  const field = err.errors.name.properties.path;
  const message = `field ${field} is required`;
  return new AppError(message, 400)
}


const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message
    });
  } else {
    // console.error("Error ", err);
    res.status(500).json({
      status: 'error',
      message: "something went very wrong"
    })
  }
};

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res);
    // } else if (process.env.NODE_ENV == 'production') {
  } else {
    let error = { ...err };
    // console.log(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === "CastError") error = handleCastErrorDB(error);

    // console.log(error.errors.email & error.errors.email.kind === "required");

    sendErrorProd(error, res);
  }
};
