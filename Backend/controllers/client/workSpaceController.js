const asyncHandler = require("express-async-handler");
const CoworkingSpace = require("../../models/coworkingSpaceModel");
const City = require("../../models/cityModel");
const MicroLocation = require("../../models/microLocationModel");

const getWorkSpaces = asyncHandler(async (req, res) => {
  try {
    const coworkingSpace = await CoworkingSpace.find();

    if (!coworkingSpace) {
      return res.status(404).json({ message: "Coworking space not found" });
    }

    res.json(coworkingSpace);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

const getWorkSpacesById = asyncHandler(async (req, res) => {
  try {
    const workSpace = await CoworkingSpace.findById(
      req.params.workSpaceId
    ).exec();
    res.status(200).json(workSpace);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const searchWorkSpacesByName = asyncHandler(async (req, res) => {
  const { name } = req.query;

  try {
    const workSpaceData = await CoworkingSpace.find({
      name: { $regex: name, $options: "i" },
    });
    res.json(workSpaceData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while searching for coworking spaces.",
    });
  }
});

const getWorkSpacesbyCity = asyncHandler(async (req, res) => {
  const cityName = req.params.city;

  try {
    const city = await City.findOne({ name: cityName }).exec();

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    const coworkingSpaces = await CoworkingSpace.find({
      "location.city": city._id,
      status: "approve",
    }).exec();

    res.json(coworkingSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getWorkSpacesbyMicrolocation = asyncHandler(async (req, res) => {
  const microlocation = req.params.microlocation;

  try {
    const micro_location = await MicroLocation.findOne({
      name: microlocation,
    }).exec();

    if (!micro_location) {
      return res.status(404).json({ error: "microlocation not found" });
    }

    const coworkingSpaces = await CoworkingSpace.find({
      "location.micro_location": micro_location._id,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .exec();

    res.json(coworkingSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  getWorkSpaces,
  getWorkSpacesById,
  getWorkSpacesbyCity,
  searchWorkSpacesByName,
  getWorkSpacesbyMicrolocation,
};
