const asyncHandler = require("express-async-handler");
const MicroLocation = require("../../models/microLocationModel");
const City = require("../../models/microLocationModel");

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

// const getMicrolocationByCityName = asyncHandler(async (req, res) => {
//   const { cityname } = req.params;
//   console.log(cityname);

//   try {
//     const city = await City.findOne({ name: cityname });

//     if (!city) {
//       console.log(`City not found for ${cityname}`);
//       return res.status(404).json({ error: "City not found" });
//     }

//     const microlocations = await MicroLocation.find({ city: city._id });

//     res.json(microlocations);
//     console.log(microlocations);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
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
  getMicroLocation,
  getMicrolocationByCity,
  getMicroBycityName,
};
