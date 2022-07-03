const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }
const saleSchema = mongoose.Schema({
    saleNumber: {
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
            price: {
                type: Number,
                required: true
            },
            subtotal: {
                type: Number,
                required: true,
                default: function () {
                    return this.quantity * this.price
                }
            }
        }
    ],
    date: {
        type: Date,
        required: true,
        default: new Date()
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
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: function () {
            return this.paymentType === 'invoice'
        }
    },
    status: {
        type: String
    },
    user: {
        type: String,
        required: true,
    },
}, opts)


// create a virtual property `invoice` that's computed from `custome invoice transactions` in the transaction document
saleSchema.virtual('invoice').get(function () {
    let number;
    if (this.saleNumber / 10 < 1) {
        number = `00${this.saleNumber}`
    } else if (this.saleNumber / 100 < 1) {
        number = `0${this.saleNumber}`
    } else {
        number = this.saleNumber
    }
    return `INV-${number}`;
});


// auto generate Product ID
saleSchema.pre("validate", async function (next) {
    //sorting students
    const sales = await Sale.find({}).sort([["saleNumber", -1]]);
    if (sales.length > 0) {
        this.saleNumber = sales[0].saleNumber + 1;
    }
    next();
});


const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
