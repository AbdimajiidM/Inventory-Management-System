const catchAsync = require("./../utils/catchAsync");
const Purchase = require("../models/purchaseModel");
const Product = require("../models/productModel")
const Transaction = require("../models/transactionModel");
const Vendor = require("../models/vendorModel")
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllPurchases = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Purchase.find(), req.query).filter().sort().limitFields().paginate()
    const purchases = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: purchases.length,
        data: {
            purchases,
        },
    });
});

exports.getPurchase = catchAsync(async (req, res, next) => {
    const purchase = await Purchase.findById(req.params.id);

    res.status(200).json({
        message: "Sucess",
        data: {
            purchase
        },
    });
});

exports.createPurchase = catchAsync(async (req, res, next) => {

    // generate new purchase model
    const purchase = new Purchase(req.body);

    // validate purchase, if error send error message
    let purchaseError = purchase.validateSync();
    if (purchaseError) {
        return next(new AppError(purchaseError.message), purchaseError.status)
    }

    // // check if purchased products exists in the database
    for (let index = 0; index < purchase.products.length; index++) {
        const product = purchase.products[index];
        const dbProduct = await Product.findOne({ name: product.item });
        if (!dbProduct) {
            return next(new AppError(`${product.item} does not exist`), 400);
        }
    }
    // get vendor incase purchase is invoiced
    const vendor = purchase.vendor && await Vendor.findById(purchase.vendor).populate("transactions");

    // generate debit, credit and description values for the transaction
    const debit = purchase.paymentType == 'invoice' ? purchase.total : 0
    const credit = purchase.paymentType == 'cash' ? purchase.total : 0;
    const description = purchase.description ? purchase.description : `Purchase invoice`;

    // generate new transaction model
    const transaction = new Transaction({
        description,
        purchase: purchase.id,
        credit,
        debit,
        vendor: vendor && vendor.id,
        status: purchase.paymentType,
        type: "purchase",
        user: purchase.user,
        balance: vendor && vendor.balance + debit
    })

    // validate the new transaction, if error send error message
    let transactionError = purchase.validateSync();
    if (transactionError) {
        return next(new AppError(transactionError.message), transactionError.status)
    }

    // if sale is invoiced, add transaction the transactions field in the customer model
    if (vendor) {
        vendor.transactions.push(transaction);
    }

    // if sale and transaction validated, save both in the database
    purchase.save();
    // // update purchased products quantity
    for (let index = 0; index < purchase.products.length; index++) {
        const purchasedProduct = purchase.products[index];
        const product = await Product.findOne({ name: purchasedProduct.item });
        product.quantity += purchasedProduct.quantity;
        product.unitPrice = purchasedProduct.unitPrice;
        product.salePrice = product.salePrice;
        await product.save();
    }
    transaction.save();
    vendor && vendor.save();

    // send success Message, with the created sale
    res.status(201).json({
        status: "Success",
        data: {
            createdSale: purchase,
        },
    });
});

exports.updatePurchase = catchAsync(async (req, res, next) => {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }); res.status(201).json({
        status: "Success",
        data: {
            purchase,
        },
    });
});

exports.deletePurchase = catchAsync(async (req, res, next) => {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);

    res.status(204).json({
        status: "success",
        data: null,
    });
});