const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDiscription: {
        type:String,
        required:true
    },
    stocks:{
        type:Number,
        required: true
    },
    price: {
        type:Number,
        required: true
    },
    image:{
        data: Buffer,
        contentType: String
    }
})

const product = mongoose.model("products", productSchema);

module.exports = product;