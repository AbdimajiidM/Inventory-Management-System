const mongoose = require("mongoose");
const ContactSchema = require("../schema/ContactSchema");

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }
const customerSchema = mongoose.Schema({
    ...ContactSchema,
    customerId: {
        type: Number,
        default: 1,
        unique: true
    },
    contact: {
        type: String
    },
    deadline: {
        type: Date
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]
}, opts)

// create a virtual property `credit` that's computed from `custome invoice transactions` in the transaction document
customerSchema.virtual('debit').get(function () {
    const debitTransactions = this.transactions.filter((transaction) => transaction.debit);
    let debit = 0;
    debitTransactions.forEach(transaction => {
        debit += transaction.debit;
    });
    return debit;
});


// create a virtual property `debit` that's computed from `customer payment transactions` in the transaction document
customerSchema.virtual('credit').get(function () {
    const creditTransactions = this.transactions.filter((transaction) => transaction.credit != null);
    let credit = 0;
    creditTransactions.forEach(transaction => {
        credit += transaction.credit;
    });
    return credit;
});

// create a virtual property `balance` that's computed from `credit` adn `debit` Accounts
customerSchema.virtual('balance').get(function () {
    const balance = this.debit - this.credit
    return balance;
});



// auto generate Customer ID
customerSchema.pre("validate", async function (next) {
    //sorting students
    const customers = await Customer.find({}).sort([["customerId", -1]]);
    if (customers.length > 0) {
        this.customerId = customers[0].customerId + 1;
    }
    next();
});


const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
