const express = require("express");
const router = express.Router();
const product = require("../model/productScheme");


router.get("/products", async function(req, res){
    const data = await product.find();

    res.send(data);
})

module.exports = router;

