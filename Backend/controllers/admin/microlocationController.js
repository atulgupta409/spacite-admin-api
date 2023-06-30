const asyncHandler = require("express-async-handler");
const MicroLocation = require("../../models/microLocationModel");
const City = require("../../models/cityModel");

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
const postMicroLocation = asyncHandler(async (req, res) => {
  const { name, description, country, state, city } = req.body;
  try {
    const microLocationData = await MicroLocation.create({
      name,
      description,
      country,
      state,
      city,
    });

    res.json(microLocationData);
  } catch (error) {
    console.log(error);
  }
});
const deleteMicroLocation = asyncHandler(async (req, res) => {
  const { microlocationId } = req.params;
  await MicroLocation.findByIdAndDelete(microlocationId)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});
const getMicrolocationByCity = asyncHandler(async (req, res) => {
  await MicroLocation.find({ city: req.body.city_id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
const getMicroBycityName = asyncHandler(async (req, res) => {
  const cityname = req.params.cityname;
  console.log(cityname);
  try {
    const city = await City.findOne({
      name: cityname,
    }).exec();

    if (!city) {
      return res.status(404).json({ error: "city not found" });
    }

    const microlocation = await MicroLocation.find({
      city: city._id,
    }).exec();

    res.json(microlocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  getMicroBycityName,
  getMicroLocation,
  postMicroLocation,
  deleteMicroLocation,
  getMicrolocationByCity,
};
