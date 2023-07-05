const asyncHandler = require("express-async-handler");
const CoworkingSpace = require("../../models/coworkingSpaceModel");
const City = require("../../models/cityModel");
const MicroLocation = require("../../models/microLocationModel");

const getWorkSpaces = asyncHandler(async (req, res) => {
  try {
    const coworkingSpace = await CoworkingSpace.find({ status: "approve" })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("location.state", "name")
      .populate("location.country", "name")
      .populate("plans.category", "name")
      .exec();

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
const getWorkSpacesbyCityId = asyncHandler(async (req, res) => {
  const { cityId } = req.params;

  try {
    const coworkingSpaces = await CoworkingSpace.find({
      "location.city": cityId,
      status: "approve",
    }).exec();

    res.json(coworkingSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getWorkSpacesbyMicrolocation = asyncHandler(async (req, res) => {
  const microlocation = req.params.microlocation;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of results per page

  try {
    const micro_location = await MicroLocation.findOne({
      name: { $regex: new RegExp(microlocation, "i") },
    }).exec();

    if (!micro_location) {
      return res.status(404).json({ error: "microlocation not found" });
    }

    const totalCount = await CoworkingSpace.countDocuments({
      "location.micro_location": micro_location._id,
      status: "approve",
    }).exec();

    const totalPages = Math.ceil(totalCount / limit); // Calculate total number of pages
    const count = await CoworkingSpace.countDocuments({
      "location.micro_location": micro_location._id,
      status: "approve",
    });
    const coworkingSpaces = await CoworkingSpace.find({
      "location.micro_location": micro_location._id,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .skip((page - 1) * limit) // Skip results based on page number
      .limit(limit) // Limit the number of results per page
      .exec();

    res.json({
      totalPages,
      totalCount: count,
      currentPage: page,
      coworkingSpaces,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getWorkSpacesbyMicrolocationId = asyncHandler(async (req, res) => {
  const microlocation = req.params.microlocation;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of results per page

  try {
    // Calculate total number of pages
    const count = await CoworkingSpace.countDocuments({
      "location.micro_location": microlocation,
      status: "approve",
    });
    const totalPages = Math.ceil(count / limit);
    const coworkingSpaces = await CoworkingSpace.find({
      "location.micro_location": microlocation,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .skip((page - 1) * limit) // Skip results based on page number
      .limit(limit) // Limit the number of results per page
      .exec();

    res.json({
      totalPages,
      totalCount: count,
      currentPage: page,
      coworkingSpaces,
    });
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
  getWorkSpacesbyMicrolocationId,
  getWorkSpacesbyCityId,
};
