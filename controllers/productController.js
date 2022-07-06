const catchAsync = require("./../utils/catchAsync");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Product.find(), req.query).filter().sort().limitFields().paginate()
    const products = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: products.length,
        data: {
            products,
        },
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    res.status(200).json({
        message: "Sucess",
        data: {
            product
        },
    });
});

exports.createProduct = catchAsync(async (req, res, next) => {
    const createdProduct = await Product.create(req.body)
    res.status(201).json({
        status: "Success",
        data: {
            createdProduct,
        },
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }); res.status(201).json({
        status: "Success",
        data: {
            product,
        },
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError("No product found with that ID", 404));
    }
    if (product.quantity) {
        return next(new AppError("Product Quantity Must be 0, to delete"), 400)
    }

    product.remove();

    // product.save();

    res.status(204).json({
        status: "success",
        data: null,
    });
});