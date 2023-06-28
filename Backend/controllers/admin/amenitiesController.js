const asyncHandler = require("express-async-handler");
const Amenity = require("../../models/amenitiesModel");

const getAmenities = asyncHandler(async (req, res) => {
  await Amenity.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
const postAmenities = asyncHandler(async (req, res) => {
  const { name, icon } = req.body;
  try {
    const amenitiesData = await Amenity.create({
      name,
      icon,
    });

    res.json(amenitiesData);
  } catch (error) {
    console.log(error);
  }
});
const deleteAmenities = asyncHandler(async (req, res) => {
  const { amenityId } = req.params;
  await Amenity.findByIdAndDelete(amenityId)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});

module.exports = { getAmenities, postAmenities, deleteAmenities };
