const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/sendmail", (req, res) => {
  const {
    name,
    email,
    phone,
    office_type,
    no_of_seats,
    move_in,
    query,
    your_city,
    plan_type,
    when_to,
    location,
  } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });
    let emailContent;
    if (query) {
      emailContent = `<ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>Office Type: ${office_type}</li>
      <li>No. of seats: ${no_of_seats}</li>
      <li>Query: ${query}</li>
      <li>Page Location: ${location}</li>
    </ul>`;
    } else if (your_city) {
      emailContent = `<ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>City: ${your_city}</li>
      <li>Plan Type: ${plan_type}</li>
      <li>When To: ${when_to}</li>
      <li>Page Location: ${location}</li>
    </ul>`;
    } else {
      emailContent = `<ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>Office Type: ${office_type}</li>
      <li>No. of seats: ${no_of_seats}</li>
      <li>Move in: ${move_in}</li>
      <li>Page Location: ${location}</li>
    </ul>`;
    }

    const mailOptions = {
      from: email,
      to: process.env.EMAIL,
      subject: "Query from spacite",
      html: emailContent,
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
