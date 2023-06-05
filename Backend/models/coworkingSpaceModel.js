const mongoose = require("mongoose");

const coworkingSpaceModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    website_Url: String,
    images: [
      {
        type: String,
      },
    ],
    amenties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Amenty",
      },
    ],
    seo: {
      title: { type: String },
      description: { type: String },
      robots: String,
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
    location: {
      name: String,
      name1: String,
      floor: String,
      address: String,
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
      },
      state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
      },
      city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
      },
      micro_location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MicroLocation",
      },
      latitude: Number,
      longitude: Number,
      is_near_metro: {
        type: Boolean,
        default: false,
      },
      is_ferry_stop: {
        type: Boolean,
        default: false,
      },
      is_bus_stop: {
        type: Boolean,
        default: false,
      },
      is_taxi_stand: {
        type: Boolean,
        default: false,
      },
      is_tram: {
        type: Boolean,
        default: false,
      },
      is_hospital: {
        type: Boolean,
        default: false,
      },
      is_school: {
        type: Boolean,
        default: false,
      },
      is_restro: {
        type: Boolean,
        default: false,
      },
    },
    hours_of_operation: {
      monday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: true,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      tuesday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      wednesday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      thursday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      friday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      saturday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
      sunday: {
        from: String,
        to: String,
        should_show: {
          type: Boolean,
          default: false,
        },
        is_closed: {
          type: Boolean,
          default: false,
        },
        is_open_24: {
          type: Boolean,
          default: false,
        },
      },
    },
    no_of_seats: Number,
    plans: [
      {
        duration: {
          type: String,
          enum: ["month", "year", "week", "day", "hour"],
          default: "hour",
        },
        time_period: Number,
        price: Number,
        number_of_items: {
          type: Number,
          default: 1,
        },
        should_show: {
          type: Boolean,
          default: true,
        },
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["pending", "approve", "reject"],
      default: "pending",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    slug: String,
    is_popular: {
      value: {
        type: Boolean,
        default: false,
      },
      order: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const CoworkingSpace = mongoose.model("CoworkingSpace", coworkingSpaceModel);
module.exports = CoworkingSpace;
