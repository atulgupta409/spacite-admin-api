const mongoose = require("mongoose");

const brandModel = mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    description: String,
    order: { type: Number, default: 0 },
    should_show_on_home: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["coworking", "virtual office", "officespace"],
      default: "coworking",
    },
    image: String,
    featureImage: String,
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
    ],
    slug: String,
    seo: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      footer_title: String,
      footer_description: String,
      robots: String,
      index: Boolean,
      keywords: String,
      url: String,
      status: {
        type: Boolean,
        default: true,
      },
      twitter: {
        title: String,
        description: String,
      },
      open_graph: {
        title: String,
        description: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandModel);
module.exports = Brand;
