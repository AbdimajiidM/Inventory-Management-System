const catchAsync = require("./../utils/catchAsync");
const Vendor = require("../models/vendorModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllVendors = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(await Customer.find().populate({
        path: 'transactions',
        populate: {
            path: 'purchase',
            model: 'Purchase',
        }
    }), req.query).filter().sort().limitFields().paginate()
    const vendors = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: vendors.length,
        data: {
            vendors,
        },
    });
});

exports.getVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findById(req.params.id).populate("transactions");
    res.status(200).json({
        message: "Sucess",
        data: {
            vendor
        },
    });
});

exports.createVendor = catchAsync(async (req, res, next) => {
    const createdVendor = await Vendor.create(req.body)
    res.status(201).json({
        status: "Success",
        data: {
            createdVendor,
        },
    });
});

exports.updateVendor = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(201).json({
        status: "Success",
        data: {
            vendor,
        },
    });
});
