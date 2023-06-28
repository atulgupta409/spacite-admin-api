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
const app = express();
const AWS = require("aws-sdk");
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
app.use(notFound);
app.use(errorHandle);

app.listen(
  process.env.PORT,
  console.log(`server started on ${process.env.PORT}`)
);