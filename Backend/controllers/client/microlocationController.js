const asyncHandler = require("express-async-handler");
const MicroLocation = require("../models/microlocationModel");
const City = require("../models/cityModel");

const getMicroLocation = asyncHandler(async (req, res) => {
  await MicroLocation.find({})
    .populate("country", "name")
    .populate("state", "name")
    .populate("city", "name")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

const getMicrolocationByCity = asyncHandler(async (req, res) => {
  await MicroLocation.find({ city: req.body.city_id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

const getMicrolocationByCityName = asyncHandler(async (req, res) => {
  const { cityName } = req.params;

  try {
    const city = await City.findOne({ name: cityName });

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    const microlocations = await MicroLocation.find({ city: city._id });

    res.json(microlocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = {
  getMicroLocation,
  getMicrolocationByCity,
  getMicrolocationByCityName,
};
