const mongoose = require("mongoose");

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } }
const productSchema = mongoose.Schema({
    productId: {
        type: Number,
        default: 1
    },
    name: {
        type: String,
        default: 1,
        unique: true
    },
    unitMeasurment: {
        type: String
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    salePrice: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    category: {
        type: String
    }
}, opts)




// auto generate Product ID
productSchema.pre("validate", async function (next) {
    //sorting students
    const products = await Product.find({}).sort([["productId", -1]]);
    if (products.length > 0) {
        this.productId = products[0].productId + 1;
    }
    next();
});


const Product = mongoose.model('product', productSchema);

module.exports = Product;
