const catchAsync = require("../utils/catchAsync");
const Transaction = require("../models/transactionModel");
const createTransactionFn = require("./functions/createTransactionFn")

const AppError = require("../utils/appError");


exports.getAllTransaction = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find().populate('customer').populate("sale");
  res.status(200).json({
    message: "Sucess",
    count: transactions.length,
    data: {
      transactions,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  res.status(200).json({
    message: "Sucess",
    data: {
      transaction,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transactionId = req.params.transactionId;
  const transaction = await Transaction.findOne({ transactionId });
  res.json({
    status: "success",
    transaction
  })
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const response = await createTransactionFn(req.body, req, res, next);

  res.status(response.statusCode).json({
    response,
  });
});



