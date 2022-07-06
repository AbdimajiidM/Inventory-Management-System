const mongoose = require("mongoose");
const ContactSchema = require("../schema/ContactSchema");

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }
const vendorSchema = mongoose.Schema({
    ...ContactSchema,
    vendorId: {
        type: Number,
        default: 1,
        unique: true
    },
    contact: {
        type: String
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]
}, opts)

// create a virtual property `credit` that's computed from `custome invoice transactions` in the transaction document
vendorSchema.virtual('debit').get(function () {
    const debitTransactions = this.transactions.filter((transaction) => transaction.debit);
    let debit = 0;
    debitTransactions.forEach(transaction => {
        debit += transaction.debit;
    });
    return debit;
});


// create a virtual property `debit` that's computed from `customer payment transactions` in the transaction document
vendorSchema.virtual('credit').get(function () {
    const creditTransactions = this.transactions.filter((transaction) => transaction.credit != null);
    let credit = 0;
    creditTransactions.forEach(transaction => {
        credit += transaction.credit;
    });
    return credit;
});

// create a virtual property `balance` that's computed from `credit` adn `debit` Accounts
vendorSchema.virtual('balance').get(function () {
    const balance = this.debit - this.credit
    return balance;
});




// auto generate Customer ID
vendorSchema.pre("validate", async function (next) {
    //sorting students
    const vendors = await Vendor.find({}).sort([["vendorId", -1]]);
    if (vendors.length > 0) {
        this.vendorId = vendors[0].vendorId + 1;
    }
    next();
});


const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
