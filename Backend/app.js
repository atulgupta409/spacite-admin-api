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
// Define the API route to update the priority order
app.put("/workspaces/priority", (req, res) => {
  const { workspaceId, newPriorityOrder } = req.body;

  CoworkingSpace.findById(workspaceId)
    .then((workspace) => {
      if (!workspace) {
        return res.status(404).send("Workspace not found");
      }

      const oldPriorityOrder = workspace.priority.overall.order;

      // Update the priority order of the specified workspace
      workspace.priority.overall.order = newPriorityOrder;
      workspace
        .save()
        .then(() => {
          // Find all workspaces with the same old priority order
          CoworkingSpace.updateMany(
            { "priority.overall.order": oldPriorityOrder },
            { $set: { "priority.overall.order": newPriorityOrder } }
          )
            .then(() => {
              res.json({ message: "Priority order updated successfully" });
            })
            .catch((error) => {
              console.error(
                "Error while updating priority order for all workspaces",
                error
              );
              res.status(500).send("Internal server error");
            });
        })
        .catch((error) => {
          console.error(
            "Error while updating priority order for the workspace",
            error
          );
          res.status(500).send("Internal server error");
        });
    })
    .catch((error) => {
      console.error("Error while finding the workspace", error);
      res.status(500).send("Internal server error");
    });
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
