const Transaction = require('../../models/transactionModel')
const Customer = require('../../models/customerModel');
const AppError = require("../../utils/appError")


async function createTransactionFn(transaction, req, res, next) {

    try {
        // get Customer with transaction Customer ID
        const customer = await Customer.findById(transaction.customer).populate("transactions");
        if (!customer) return next(new AppError('No Customer found with that ID', 400));

        const balance = transaction.credit ? customer.balance - transaction.credit : customer.balance + transaction.debit

        // create transaction with Customer current balance
        const createdTransaction = await Transaction.create({ ...transaction, balance });

        // add transaction id as refrence in the Customer document
        customer.transactions.push(createdTransaction._id);
        // save the Customer with updated credit or debit account
        await customer.save();

        // return created transaction
        return {
            statusCode: 200,
            status: "success",
            message: "transactionn sucessfully created",
            treansaction: createdTransaction
        };
    } catch (error) {
        // return error response
        return next(new AppError(error.message), error.statusCode)
        return {
            statusCode: 400,
            status: "failed",
            message: "transaction failed to create!",
            error: error
        };
    }
}

module.exports = createTransactionFn;