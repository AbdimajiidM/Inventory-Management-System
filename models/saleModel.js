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
            quantity: Number,
            price: Number,
            subtotal: {
                type: Number,
                default: function () {
                    return this.quantity * this.price
                }
            }
        }
    ],
    date: {
        type: Date,
        default: new Date()
    },
    total: {
        type: Number,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
}, opts)





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
