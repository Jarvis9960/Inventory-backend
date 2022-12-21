const express = require("express");
const connectDB = require("./DB/connect");
const dotenv = require("dotenv");
const authetication = require("./router/auth");
const addproduct = require("./router/addproducts");
const product = require("./router/products");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"https://inventory-front-9jlad8nin-jarvis9960.vercel.app",
    methods:["GET","POST","PUT","DELETE"]  
 }))
app.use(authetication);
app.use(addproduct);
app.use(product);

dotenv.config("./DB/config.env");

PORT = process.env.PORT;

console.log(PORT);

app.listen(PORT, function (req, res){
    console.log(`server is running on ${PORT}`);
});

app.get("/", function(req, res){
    res.cookie("savedCookie", "Ankit");
    res.send("hello welcome to my Home page");
})

connectDB().then(()=>{
    console.log("connection is succesfull ");
}).catch((err)=>{
    console.log(err);
});


