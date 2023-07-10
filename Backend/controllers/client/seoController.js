const asyncHandler = require("express-async-handler");
const SEO = require("../../models/seoModel");

const getSeo = asyncHandler(async (req, res) => {
  SEO.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

module.exports = { getSeo };
