const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose.set("strictQuery", true);

dotenv.config({path:"./DB/config.env"});

url = process.env.DATABASE;

const connectDB = function () {
return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
}


module.exports = connectDB;