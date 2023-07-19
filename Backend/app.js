const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/admin/userRoutes");
const connectDB = require("./config/db");
const { notFound, errorHandle } = require("./middleware/errorMiddleware");
const countryRoute = require("./routes/admin/countryRoutes");
const stateRoute = require("./routes/admin/stateRoutes");
const imageUploadRouter = require("./routes/admin/imageUploadRoutes");
const cityRouter = require("./routes/admin/cityRoutes");
const microlocationRouter = require("./routes/admin/microLocationRoutes");
const amenityRouter = require("./routes/admin/amenitiesRoutes");
const propertytypeRouter = require("./routes/admin/propertyTypeRoutes");
const seoRouter = require("./routes/admin/seoRoutes");
const brandRouter = require("./routes/admin/brandRoutes");
const workSpaceRouter = require("./routes/admin/coworkingSpaceRoutes");
const clientCityRoutes = require("./routes/client/cityRoutes");
const clientcountryRoutes = require("./routes/client/countryRoutes");
const clientMicrolocationRoutes = require("./routes/client/microlocationRoutes");
const clientStateRoutes = require("./routes/client/stateRoutes");
const clientWorkSpaceRoutes = require("./routes/client/workSpaceRoutes");
const ourClientRouter = require("./routes/admin/ourClientRoutes");
const clientRouter = require("./routes/client/ourClientsRoutes");
const clientSeoRouter = require("./routes/client/seoRoutes");
const clientBrandRouter = require("./routes/client/brandRoutes");
const CoworkingSpace = require("./models/coworkingSpaceModel");
const MicroLocation = require("./models/microLocationModel");
const app = express();
const AWS = require("aws-sdk");
const contactFormRouter = require("./routes/client/contactFormRouter");
require("dotenv").config();
connectDB();

// -----------------aws-s3------------------------
const s3Client = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(contactFormRouter);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowedFormats = ["image/jpeg", "image/png", "image/svg+xml"];

app.post("/upload-image", upload.array("files"), (req, res) => {
  const promiseArray = [];

  req.files.forEach((file) => {
    // Check if the file format is allowed
    if (allowedFormats.includes(file.mimetype)) {
      const params = {
        Acl: "public-read",
        Bucket: process.env.BUCKET_NAME,
        Key: `image-${Date.now()}.${file.originalname.split(".").pop()}`,
        Body: file.buffer,
      };

      const putObjectPromise = s3Client.upload(params).promise();
      promiseArray.push(putObjectPromise);
    } else {
      console.log(
        `Skipping file ${file.originalname} due to unsupported format.`
      );
    }
  });

  Promise.all(promiseArray)
    .then((values) => {
      console.log(values);
      const urls = values.map((value) => value.Location);
      console.log(urls);
      res.send(urls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
// -----------------aws-s3------------------------

app.put("/api/coworkingspaces/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active, microlocationId } = req.body;

    // Find the coworking space to be updated
    const coworkingSpaceToUpdate = await CoworkingSpace.findById(id);

    if (!coworkingSpaceToUpdate) {
      return res.status(404).json({ error: "Coworking space not found" });
    }

    const currentOrder = coworkingSpaceToUpdate.priority.order;
    if (
      coworkingSpaceToUpdate.location.micro_location.toString() !==
      microlocationId
    ) {
      return res.status(400).json({
        error: "Coworking space does not belong to the specified microlocation",
      });
    }
    if (is_active === false && order === 1000) {
      // Deactivate priority for the current coworking space
      coworkingSpaceToUpdate.priority.is_active = false;
      coworkingSpaceToUpdate.priority.order = order;
      await coworkingSpaceToUpdate.save();

      // Decrement the higher order coworking spaces by one
      await CoworkingSpace.updateMany(
        {
          "location.micro_location": microlocationId,
          _id: { $ne: id }, // Exclude the current coworking space
          "priority.order": { $gt: currentOrder }, // Higher order workspaces
          "priority.is_active": true,
        },
        { $inc: { "priority.order": -1 } }
      );
    } else {
      // Update the priority of the coworking space to the specified order
      coworkingSpaceToUpdate.priority.order = order;

      // Update the "is_active" field based on the specified order
      coworkingSpaceToUpdate.priority.is_active = order !== 1000;

      await coworkingSpaceToUpdate.save();
    }

    res.json(coworkingSpaceToUpdate);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.put("/api/updateCoworkingSpacesPriority", async (req, res) => {
  try {
    const updatedSpaces = req.body; // The array of updated spaces sent from the client

    // Loop through the updatedSpaces array and update each coworking space in the database
    for (const space of updatedSpaces) {
      const { _id, priority } = space;
      // Find the coworking space by its _id and update its priority order
      await CoworkingSpace.findByIdAndUpdate(_id, {
        $set: {
          "priority.order": priority.order,
          "priority.is_active": priority.order !== 1000,
        },
      });
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});
app.put("/api/priority-microlocation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { order, is_active, microlocationId } = req.body;

    // Find the coworking space to be updated
    const microlocationToUpdate = await MicroLocation.findById(id);
    if (!microlocationToUpdate) {
      return res.status(404).json({ error: "microlocation not found" });
    }

    const currentOrder = microlocationToUpdate.priority.order;
    if (is_active === false && order === 1000) {
      // Deactivate priority for the current coworking space
      microlocationToUpdate.priority.is_active = false;
      microlocationToUpdate.priority.order = order;
      await microlocationToUpdate.save();

      // Decrement the higher order coworking spaces by one
      await MicroLocation.updateMany(
        {
          _id: { $ne: id }, // Exclude the current coworking space
          "priority.order": { $gt: currentOrder }, // Higher order workspaces
          "priority.is_active": true,
        },
        { $inc: { "priority.order": -1 } }
      );
    } else {
      // Update the priority of the coworking space to the specified order
      microlocationToUpdate.priority.order = order;

      // Update the "is_active" field based on the specified order
      microlocationToUpdate.priority.is_active = order !== 1000;

      await microlocationToUpdate.save();
    }

    res.json(microlocationToUpdate);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});
app.put("/api/updateMicrolocationPriority", async (req, res) => {
  try {
    const updatedMicrolocation = req.body; // The array of updated spaces sent from the client

    // Loop through the updatedSpaces array and update each coworking space in the database
    for (const micro of updatedMicrolocation) {
      const { _id, priority } = micro;
      // Find the coworking space by its _id and update its priority order
      await MicroLocation.findByIdAndUpdate(_id, {
        $set: {
          "priority.order": priority.order,
          "priority.is_active": priority.order !== 1000,
        },
      });
    }

    res.json({ message: "Priority updated successfully" });
  } catch (error) {
    console.error("Error updating priority:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating priority" });
  }
});
app.use("/api/user", userRoute);
app.use("/api/allCountry", countryRoute);
app.use("/api/state", stateRoute);
app.use("/api/image", imageUploadRouter);
app.use("/api/city", cityRouter);
app.use("/api/microlocation", microlocationRouter);
app.use("/api/amenity", amenityRouter);
app.use("/api/propertytype", propertytypeRouter);
app.use("/api/seo", seoRouter);
app.use("/api/brand", brandRouter);
app.use("/api/workSpace", workSpaceRouter);
app.use("/api/ourClient", ourClientRouter);
app.use("/api", clientCityRoutes);
app.use("/api/micro-location", clientMicrolocationRoutes);
app.use("/api", clientStateRoutes);
app.use("/api", clientcountryRoutes);
app.use("/api", clientWorkSpaceRoutes);
app.use("/api/client", clientRouter);
app.use("/api/seo", clientSeoRouter);
app.use("/api/brands", clientBrandRouter);
app.use(notFound);
app.use(errorHandle);

app.listen(
  process.env.PORT,
  console.log(`server started on ${process.env.PORT}`)
);
