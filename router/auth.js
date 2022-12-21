const express = require("express");
const router = express.Router();
const connectDB = require("../DB/connect");
const user = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../DB/config.env" });
const serviceSid = require("./twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const middleware = function (req, res, next) {
  console.log("hello welcome to my middleware");
  next();
};

router.get("/", function (req, res) {
  res.send("Hello welcome to my server");
});

router.post("/register", async function (req, res) {
  const { name, email, phone, password, cpassword } = req.body;

  if (!name || !email || !phone || !password || !cpassword) {
    res.status(422).json({ Message: "please fill all the details" });
  }

  try {
    const userExist = await user.findOne({ email: email });

    if (userExist) {
      res.status(422).json({ Message: "user already exist " });
    } else if (password != cpassword) {
      res.status(422).json({ Message: "Password isn't matching" });
    } else {
      const newUser = new user({ name, email, phone, password, cpassword });

      const person = await newUser.save();

      if (person) {
        res.status(201).json({ message: "user registered succesfully" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ message: "Invalid crediatial" });
  }

  console.log(email, password);
  try {
    const dbEmail = await user.findOne({ email: email });

    if (!dbEmail) {
      res
        .status(422)
        .json({ message: "email doesn't exist please register first" });
    }

    const dbPass = bcrypt.compareSync(password, dbEmail.password);

    if (dbEmail.email != email) {
      return res
        .status(422)
        .json({ message: "email doesn't exist please register first" });
    } else {
      if (email === dbEmail.email && dbPass === true) {
        const token = await dbEmail.generateAuthAndToken();

        res.cookie("savedCookie", token, {
          expires: new Date(Date.now() + 86400000),
          httpOnly: true,
        });

        res.status(201).json({ user: dbEmail, message: "Login successfull" });
      } else {
        res.status(422).json({ message: "Login failed" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/loginwithphone", async function (req, res) {
  const phoneNo = req.body.phone;

  console.log(phoneNo);
  const sid = await serviceSid;

  const checkPhoneUser = await user.findOne({ phone: phoneNo });

  if (!checkPhoneUser) {
    return res.status(422).json({ message: "user doesn't exist exist" });
  }

  try {
    console.log("inside this function");

    const response = await client.verify.v2
      .services(sid)
      .verifications.create({ to: `+91${phoneNo}`, channel: "sms" });

    const status = await response.status;

    if (status === "pending") {
      res.status(201).json({ message: "OTP is send to your mobile phone" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/verifywithphone", async function (req, res) {
  const { phone, OTP } = req.body;

  const sid = await serviceSid;

  const userExist = await user.findOne({ phone: phone });

  if (!OTP) {
    return res.status(422).json({ message: "please fill otp" });
  }

  try {
    if (OTP) {
      const verified = await client.verify.v2
        .services(sid)
        .verificationChecks.create({ to: `+91${phone}`, code: OTP });

      console.log(verified);

      if (verified.status === "approved") {
        res.status(201).json(userExist);
      } else {
        res.status(404).json({ message: "Login failed" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
