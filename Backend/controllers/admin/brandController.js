const asyncHandler = require("express-async-handler");
const Brand = require("../../models/brandModel");

const getBrand = asyncHandler(async (req, res) => {
  Brand.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
const postBrand = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    order,
    image,
    seo,
    cities,
    type,
    slug,
    should_show_on_home,
  } = req.body;

  try {
    const brandData = await Brand.create({
      name,
      description,
      order,
      image,
      seo,
      cities,
      type,
      slug,
      should_show_on_home,
    });
    res.json(brandData);
  } catch (error) {
    console.log(error);
  }
});
const addOrEditBrand = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    order,
    image,
    seo,
    cities,
    type,
    slug,
    should_show_on_home,
  } = req.body;
  const { brandId } = req.params;
  Brand.findByIdAndUpdate(
    brandId,
    {
      name,
      description,
      order,
      image,
      seo,
      cities,
      type,
      slug,
      should_show_on_home,
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
const deleteBrand = asyncHandler(async (req, res) => {
  const { brandId } = req.params;
  await Brand.findByIdAndDelete(brandId)
    .then(() => {
      res.send("delete successfully");
    })
    .catch((err) => {
      res.send({
        error: err,
      });
    });
});

const getBrandById = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.brandId).populate(
      "cities",
      "name"
    );
    res.status(200).json(brand);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
module.exports = {
  getBrand,
  postBrand,
  addOrEditBrand,
  deleteBrand,
  getBrandById,
};
