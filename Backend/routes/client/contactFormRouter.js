const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/sendmail", (req, res) => {
  const { name, email, phone, office_type, no_of_seats, move_in } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: "coworking mail",
      html: `<ul>
       <li>Name: ${name}</li>
       <li>Email: ${email}</li>
       <li>Phone: ${phone}</li>
       <li>Office Type: ${office_type}</li>
       <li>No. of seats: ${no_of_seats}</li>
       <li>Move in: ${move_in}</li>
      </ul>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error", error);
      } else {
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
