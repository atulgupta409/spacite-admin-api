const asyncHandler = require("express-async-handler");
const CoworkingSpace = require("../../models/coworkingSpaceModel");
const City = require("../../models/cityModel");
const MicroLocation = require("../../models/microLocationModel");
const Brand = require("../../models/brandModel");

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
    const city = await City.findOne({
      name: cityName,
    }).exec();

    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    const coworkingSpaces = await CoworkingSpace.find({
      "location.city": city._id,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .exec();

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

const getWorkSpacesbyBrand = asyncHandler(async (req, res) => {
  const brand = req.params.brand;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of results per page

  try {
    const all_brand = await Brand.findOne({
      name: { $regex: new RegExp(brand, "i") },
    }).exec();

    if (!all_brand) {
      return res.status(404).json({ error: "brand not found" });
    }

    const totalCount = await CoworkingSpace.countDocuments({
      brand: all_brand._id,
      status: "approve",
    }).exec();

    const totalPages = Math.ceil(totalCount / limit); // Calculate total number of pages
    const count = await CoworkingSpace.countDocuments({
      brand: all_brand._id,
      status: "approve",
    });
    const coworkingSpaces = await CoworkingSpace.find({
      brand: all_brand._id,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("location.state", "name")
      .populate("location.country", "name")
      .populate("plans.category", "name")
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
const getWorkSpacesbySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  try {
    const coworkingSpaces = await CoworkingSpace.find({
      slug: slug,
      status: "approve",
    })
      .populate("amenties", "name")
      .populate("brand", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("location.state", "name")
      .populate("location.country", "name")
      .populate("plans.category", "name")
      .exec();

    res.json(coworkingSpaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getWorkSpacesbyLocation = asyncHandler(async (req, res) => {
  const workspaceSlug = req.params.workspaceSlug;

  CoworkingSpace.findOne({ slug: workspaceSlug })
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).send("Workspace not found");
      }

      CoworkingSpace.find({
        _id: { $ne: workspace._id },
        "location.latitude": {
          $gte: workspace.location.latitude - 0.027,
          $lte: workspace.location.latitude + 0.027,
        },
        "location.longitude": {
          $gte: workspace.location.longitude - 0.027,
          $lte: workspace.location.longitude + 0.027,
        },
      })
        .populate("amenties", "name")
        .populate("brand", "name")
        .populate("location.city", "name")
        .populate("location.micro_location", "name")
        .then((nearbyWorkspaces) => {
          const result = {
            workspace,
            nearbyCount: nearbyWorkspaces.length,
            nearbyWorkspaces,
          };
          res.json(result);
        })
        .catch((error) => {
          console.error("Error while fetching nearby workspaces", error);
          res.status(500).send("Internal server error");
        });
    })
    .catch((error) => {
      console.error("Error while fetching workspace", error);
      res.status(500).send("Internal server error");
    });
});
const getWorkSpacesbyMicrolocationWithPriority = asyncHandler(
  async (req, res) => {
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
        "priority.order": { $nin: [0, 1000] }, // Exclude documents with priority.order equal to 1000
      }).exec();

      const totalPages = Math.ceil(totalCount / limit); // Calculate total number of pages
      const count = await CoworkingSpace.countDocuments({
        "location.micro_location": micro_location._id,
        status: "approve",
        "priority.order": { $nin: [0, 1000] }, // Exclude documents with priority.order equal to 1000
      });

      const coworkingSpaces = await CoworkingSpace.find({
        "location.micro_location": micro_location._id,
        status: "approve",
        "priority.order": { $nin: [0, 1000] }, // Exclude documents with priority.order equal to 1000
      })
        .populate("amenties", "name")
        .populate("brand", "name")
        .populate("location.city", "name")
        .populate("location.micro_location", "name")
        .sort({ "priority.order": 1 }) // Sort by priority.order in ascending order
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
  }
);
module.exports = {
  getWorkSpaces,
  getWorkSpacesById,
  getWorkSpacesbyCity,
  searchWorkSpacesByName,
  getWorkSpacesbyMicrolocation,
  getWorkSpacesbyMicrolocationId,
  getWorkSpacesbyCityId,
  getWorkSpacesbyBrand,
  getWorkSpacesbySlug,
  getWorkSpacesbyLocation,
  getWorkSpacesbyMicrolocationWithPriority,
};
