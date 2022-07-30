const Transaction = require("../../models/transactionModel");
const Customer = require("../../models/customerModel");
const vendor = require("../../models/vendorModel");
const AppError = require("../../utils/appError");
const Vendor = require("../../models/vendorModel");

async function createTransactionFn(transaction, req, res, next) {
  try {
    // get Customer with transaction Customer ID if customer
    const customer =
      transaction.customer &&
      (await Customer.findById(transaction.customer).populate("transactions"));

    // get vendor with transaction vendor ID if vendor
    const vendor =
      transaction.vendor &&
      (await Vendor.findById(transaction.vendor).populate("transactions"));

    // return error if both customer and vendor not found
    if (!vendor && !customer)
      return next(new AppError(" Customer or Vendor not found", 400));
    
    // return error if vendor and customer both found
    if (customer && vendor)
      return next(new AppError("Vendor or Customer is needed not both", 400));

    // generate balance for customer or vendor accordingly
    let balance;

    if (customer) {
      balance = transaction.credit
        ? customer.balance - transaction.credit
        : customer.balance + transaction.debit;
    } else if (vendor) {
      balance = transaction.credit
        ? vendor.balance - transaction.credit
        : vendor.balance + transaction.debit;
    }

    transaction.description = "Payment"
    // create transaction with Customer current balance
    const createdTransaction = await Transaction.create({
      ...transaction,
      balance,
    });

    // add transaction id as refrence in the Customer document or in the vendor document
    customer && customer.transactions.push(createdTransaction._id);
    vendor && vendor.transactions.push(createdTransaction._id);

    // save the Customer or vendor with updated credit or debit account
    customer && (await customer.save());
    vendor && (await vendor.save());

    // return created transaction
    return {
      statusCode: 200,
      status: "success",
      message: "transactionn sucessfully created",
      treansaction: createdTransaction,
    };
  } catch (error) {
    // return error response
    return next(new AppError(error.message), error.statusCode);
    return {
      statusCode: 400,
      status: "failed",
      message: "transaction failed to create!",
      error: error,
    };
  }
}

module.exports = createTransactionFn;
