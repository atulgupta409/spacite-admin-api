const asyncHandler = require("express-async-handler");
const CoworkingSpace = require("../../models/coworkingSpaceModel");
const MicroLocation = require("../../models/microLocationModel");

const postWorkSpaces = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    no_of_seats,
    website_Url,
    added_by,
    images,
    amenties,
    location,
    hours_of_operation,
    plans,
    contact_details,
    slug,
    seo,
    brand,
    is_popular,
    priority,
  } = req.body;

  try {
    const workSpaceData = await CoworkingSpace.create({
      name,
      description,
      no_of_seats,
      website_Url,
      added_by,
      images,
      amenties,
      location,
      hours_of_operation,
      plans,
      contact_details,
      slug,
      seo,
      brand,
      is_popular,
      priority,
    });
    res.json(workSpaceData);
  } catch (error) {
    console.log(error);
  }
});

const getWorkSpaces = asyncHandler(async (req, res) => {
  try {
    const coworkingSpace = await CoworkingSpace.find()
      .populate("location.country", "name")
      .populate("location.state", "name")
      .populate("location.city", "name")
      .populate("location.micro_location", "name")
      .populate("plans.category", "name")
      .populate("brand", "name")
      .populate("amenties", "name")
      .exec();

    if (!coworkingSpace) {
      return res.status(404).json({ message: "Coworking space not found" });
    }

    res.json(coworkingSpace);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
const editWorkSpaces = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    no_of_seats,
    website_Url,
    added_by,
    images,
    amenties,
    location,
    hours_of_operation,
    plans,
    contact_details,
    slug,
    seo,
    brand,
    is_popular,
    priority,
  } = req.body;
  const { workSpaceId } = req.params;
  await CoworkingSpace.findByIdAndUpdate(
    workSpaceId,
    {
      name,
      description,
      no_of_seats,
      website_Url,
      added_by,
      images,
      amenties,
      location,
      hours_of_operation,
      plans,
      contact_details,
      slug,
      seo,
      brand,
      is_popular,
      priority,
    },
    { new: true }
  )
    .then(() => res.send("updated successfully"))
    .catch((err) => {
      console.log(err);
      res.send({
        error: err,
      });
    });
});
const deleteWorkSpaces = asyncHandler(async (req, res) => {
  const { workSpaceId } = req.params;
  await CoworkingSpace.findByIdAndDelete(workSpaceId)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
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

const changeWorkSpaceStatus = asyncHandler(async (req, res) => {
  const { workSpaceId } = req.params;
  const { status } = req.body;
  try {
    const workspace = await CoworkingSpace.findById(workSpaceId);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    workspace.status = status;
    await workspace.save();

    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update status" });
  }
});
const changeWorkSpaceOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { overall, location, micro_location } = req.body;

  try {
    // Find the coworking space by ID
    const coworkingSpace = await CoworkingSpace.findById(id);

    if (!coworkingSpace) {
      return res.status(404).json({ error: "Coworking space not found" });
    }

    // Update the priority orders
    if (overall) {
      coworkingSpace.priority.overall.order = overall.order;
      coworkingSpace.priority.overall.is_active = overall.is_active;
    }
    if (location) {
      coworkingSpace.priority.location.order = location;
    }
    if (micro_location) {
      coworkingSpace.priority.micro_location.order = micro_location;
    }

    // Save the updated coworking space
    await coworkingSpace.save();

    res.json({ message: "Priority orders updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getWorkSpacesbyMicrolocation = asyncHandler(async (req, res) => {
  const microlocation = req.params.microlocation;
  const page = parseInt(req.query.page) || 1; // Current page number
  const limit = parseInt(req.query.limit) || 10; // Number of results per page

  try {
    const micro_location = await MicroLocation.findOne({
      name: microlocation,
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

module.exports = {
  postWorkSpaces,
  editWorkSpaces,
  deleteWorkSpaces,
  getWorkSpaces,
  getWorkSpacesById,
  searchWorkSpacesByName,
  changeWorkSpaceStatus,
  getWorkSpacesbyMicrolocation,
  changeWorkSpaceOrder,
};
