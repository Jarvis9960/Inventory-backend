const express = require("express");
const router = express.Router();
const connectDB = require("../DB/connect");
const multer = require("multer");
const product = require("../model/productScheme");
const path = require("path");

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({
  storage: Storage,
}).single("Image");

router.post("/addproduct", upload, async function (req, res) {
  
  try {
    const { productName, productDescription, stocks, price } = req.body;

    console.log(productName, productDescription, stocks, price);

    const Image = req.file.filename;

    if (!productName || !productDescription || !stocks || !price) {
      res.status(422).json({ message: "Please fill all the required field" });
    }
    const newProduct = new product({
      productName: productName,
      productDiscription: productDescription,
      stocks: stocks,
      price: price,
      image: {
        data: Image,
        contentType: "image/jgp",
      },
    });

    const response = await newProduct.save();

    if (response) {
      res.status(201).json({ message: "Product added successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});


// router.delete("/deleteproduct", function (req, res) {


// })

module.exports = router;
