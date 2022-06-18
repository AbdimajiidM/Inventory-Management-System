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
    const createdSale = await Sale(req.body);

    const customer = createdSale.customer && await Customer.findById(createdSale.customer).populate("transactions");
    const debit = createdSale.paymentType == 'invoice' ? createdSale.total : 0
    const credit = createdSale.paymentType == 'cash' ? createdSale.total : 0;
    const transaction = await Transaction({
        description: createdSale.description ? createdSale.description : `Customer Sales invoice #${createdSale.saleNumber}`,
        sale: createdSale.id,
        credit,
        debit,
        customer: customer && customer.id,
        status: createdSale.paymentType,
        type: "sale",
        user: createdSale.user,
        balance: customer && customer.balance + debit
    })

    if (customer) {
        customer.transactions.push(transaction);
    }

    createdSale.save();
    transaction.save();
    customer && customer.save();
    res.status(201).json({
        status: "Success",
        data: {
            createdSale,
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