const catchAsync = require("./../utils/catchAsync");
const Customer = require("../models/customerModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllCustomers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Customer.find().populate({
        path: 'transactions',
        populate: {
            path: 'sale',
            model: 'Sale',
        }
    }), req.query).filter().sort().limitFields().paginate()
    const customers = await features.query;

    res.status(200).json({
        message: "Sucess",
        count: customers.length,
        data: {
            customers,
        },
    });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id).populate("transactions");
    res.status(200).json({
        message: "Sucess",
        data: {
            customer
        },
    });
});

exports.createCustomer = catchAsync(async (req, res, next) => {
    const createdCustomer = await Customer.create(req.body)
    res.status(201).json({
        status: "Success",
        data: {
            createdCustomer,
        },
    });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(201).json({
        status: "Success",
        data: {
            customer,
        },
    });
});
