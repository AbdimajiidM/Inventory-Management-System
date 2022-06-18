const Transaction = require('../../models/transactionModel')
const Customer = require('../../models/customerModel');
const AppError = require("../../utils/appError")


async function createTransactionFn(transaction, req, res, next) {

    try {
        // get student with transaction refrece ID
        const customer = await Customer.findById(transaction.customer).populate("transactions");
        if (!customer) return next(AppError('No Customer found with that ID', 400));

        const balance = transaction.credit ? customer.balance - transaction.credit : customer.balance + transaction.debit

        // create transaction with student current balance
        const createdTransaction = await Transaction.create({ ...transaction, balance });

        // add transaction id as refrence in the student document
        customer.transactions.push(createdTransaction._id);
        // save the student with updated credit or debit account
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
        return {
            statusCode: 400,
            status: "failed",
            message: "transaction failed to create!",
            error: error
        };
    }
}

module.exports = createTransactionFn;