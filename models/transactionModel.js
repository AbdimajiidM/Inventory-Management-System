const mongoose = require('mongoose');


const transactionSchema = mongoose.Schema({
    description: {
        type: String
    },
    transactionId: {
        type: Number,
        default: 1,
    },
    debit: {
        type: Number,
        default: 0,
    },
    credit: {
        type: Number,
        default: 0,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    date: {
        type: Date,
        default: new Date(),
    },
    balance: {
        type: Number,
        // required: true,
    },
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale"
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    user: {
        type: String,
    },
    status: {
        type: String,
        lowercase: true,
    },
    transactionType: {
        type: String,
        lowercase: true,
    }
});

transactionSchema.pre("save", async function (next) {
    //sorting teachers
    const transactions = await Transaction.find({}).sort([["transactionId", -1]]);

    if (transactions.length > 0) {
        this.transactionId = transactions[0].transactionId + 1;
    }
    next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;