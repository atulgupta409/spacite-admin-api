const asyncHandler = require("express-async-handler");
const City = require("../../models/cityModel");

const postCity = asyncHandler(async (req, res) => {
  const { name, description, country, state } = req.body;
  try {
    const cityData = await City.create({
      name,
      description,
      country,
      state,
    });

    res.json(cityData);
  } catch (error) {
    console.log(error);
  }
});
const getCity = asyncHandler(async (req, res) => {
  await City.find({})
    .populate("country", "name")
    .populate("state", "name")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
const deleteCity = asyncHandler(async (req, res) => {
  const { cityId } = req.params;
  await City.findByIdAndDelete(cityId)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});

const getCityByState = asyncHandler(async (req, res) => {
  await City.find({ state: req.body.state_id })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
module.exports = { postCity, getCity, deleteCity, getCityByState };
