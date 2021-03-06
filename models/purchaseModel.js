const mongoose = require("mongoose");
const justDate = require("../utils/justDate");

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }

const purchaseSchema = mongoose.Schema({
    purchaseNumber: {
        type: Number,
        default: 1
    },
    products: [
        {
            item: String,
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: Number,
                required: true
            },
            salePrice: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true,
                default: function () {
                    return this.quantity * this.unitPrice
                }
            }
        }
    ],
    date: {
        type: Date,
        required: true,
        default: justDate(new Date())
    },
    total: {
        type: Number,
        required: true,
        default: function () {
            let amount = 0;
            this.products.forEach(product => {
                amount += product.subtotal
            });
            return amount;
        }
    },
    paymentType: {
        type: String,
        required: true,
        lowercase: true,
        enum: ['cash', 'invoice']
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: function () {
            return this.paymentType === 'invoice'
        }
    },
    status: {
        type: String
    },
    note: {
        type: String
    },
    user: {
        type: String,
        required: true,
    },
}, opts)


// create a virtual property `invoice` that's computed from `custome invoice transactions` in the transaction document
purchaseSchema.virtual('invoice').get(function () {
    let number;
    if (this.purchaseNumber / 10 < 1) {
        number = `00${this.purchaseNumber}`
    } else if (this.purchaseNumber / 100 < 1) {
        number = `0${this.purchaseNumber}`
    } else {
        number = this.purchaseNumber
    }
    return `INV-${number}`;
});
// auto generate Product ID
purchaseSchema.pre("validate", async function (next) {
    //sorting students
    const purchases = await Purchase.find({}).sort([["purchaseNumber", -1]]);
    if (purchases.length > 0) {
        this.purchaseNumber = purchases[0].purchaseNumber + 1;
    }
    next();
});


const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
