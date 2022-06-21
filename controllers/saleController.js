const catchAsync = require("./../utils/catchAsync");
const Sale = require("../models/saleModel");
const Transaction = require("../models/transactionModel");
const Customer = require("../models/customerModel")
const AppError = require("../utils/appError");

exports.getAllSales = catchAsync(async (req, res, next) => {
    const sales = await Sale.find();
    res.status(200).json({
        message: "Sucess",
        count: sales.length,
        data: {
            sales,
        },
    });
});

exports.getSale = catchAsync(async (req, res, next) => {
    const sale = await Sale.findById(req.params.id);

    res.status(200).json({
        message: "Sucess",
        data: {
            sale
        },
    });
});

exports.createSale = catchAsync(async (req, res, next) => {

    // generate new sale model
    const sale = new Sale(req.body);

    // validate sale, if error send error message
    let saleError = sale.validateSync();
    if (saleError) {
        return next(new AppError(saleError.message), saleError.status)
    }

    // get customer incase sale is invoiced
    const customer = await Customer.findById(sale.customer).populate("transactions");

    // generate debit, credit and description values for the transaction
    const debit = sale.paymentType == 'invoice' ? sale.total : 0
    const credit = sale.paymentType == 'cash' ? sale.total : 0;
    const description = sale.description ? sale.description : `Customer Sales invoice #${sale.saleNumber}`;

    // generate new transaction model
    const transaction = new Transaction({
        description,
        sale: sale.id,
        credit,
        debit,
        customer: customer && customer.id,
        status: sale.paymentType,
        type: "sale",
        user: sale.user,
        balance: customer && customer.balance + debit
    })

    // validate the new transaction, if error send error message
    let transactionError = sale.validateSync();
    if (transactionError) {
        return next(new AppError(transactionError.message), transactionError.status)
    }

    // if sale is invoiced, add transaction the transactions field in the customer model
    if (customer) {
        customer.transactions.push(transaction);
    }

    // if sale and transaction validated, save both in the database
    sale.save();
    transaction.save();
    customer && customer.save();

    // send success Message, with the created sale
    res.status(201).json({
        status: "Success",
        data: {
            createdSale: sale,
        },
    });
});

exports.updateSale = catchAsync(async (req, res, next) => {
    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }); res.status(201).json({
        status: "Success",
        data: {
            sale,
        },
    });
});

exports.deleteSale = catchAsync(async (req, res, next) => {
    const sale = await Sale.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        data: null,
    });
});