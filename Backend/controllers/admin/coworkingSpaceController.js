const asyncHandler = require("express-async-handler");
const CoworkingSpace = require("../../models/coworkingSpaceModel");

const postWorkSpaces = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    no_of_seats,
    website_Url,
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
  } = req.body;

  try {
    const workSpaceData = await CoworkingSpace.create({
      name,
      description,
      no_of_seats,
      website_Url,
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
  } = req.body;
  const { workSpaceId } = req.params;
  await CoworkingSpace.findByIdAndUpdate(
    workSpaceId,
    {
      name,
      description,
      no_of_seats,
      website_Url,
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

module.exports = {
  postWorkSpaces,
  editWorkSpaces,
  deleteWorkSpaces,
  getWorkSpaces,
  getWorkSpacesById,
  searchWorkSpacesByName,
  changeWorkSpaceStatus,
};
