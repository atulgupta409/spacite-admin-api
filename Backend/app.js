const express = require("express");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const connectDB = require("./config/db");
const { notFound, errorHandle } = require("./middleware/errorMiddleware");
const countryRoute = require("./routes/countryRoutes");
const stateRoute = require("./routes/stateRoutes");
const imageUploadRouter = require("./routes/imageUploadRoutes");
const cityRouter = require("./routes/cityRoutes");
const microlocationRouter = require("./routes/microLocationRoutes");
const amenityRouter = require("./routes/amenitiesRoutes");
const propertytypeRouter = require("./routes/propertyTypeRoutes");
const seoRouter = require("./routes/seoRoutes");
const brandRouter = require("./routes/brandRoutes");
const workSpaceRouter = require("./routes/coworkingSpaceRoutes");
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
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://15.206.251.201:3000/");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/upload-image", upload.array("files"), (req, res) => {
  const promise_array = [];
  req.files.forEach((file) => {
    const params = {
      Acl: "public-read",
      Bucket: process.env.BUCKET_NAME,
      Key: "" + `image-${Date.now()}.jpeg`,
      Body: file.buffer,
    };
    const putObjectPromise = s3Client.upload(params).promise();
    promise_array.push(putObjectPromise);
  });
  Promise.all(promise_array)
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
app.get("/get-image", (req, res) => {
  // console.log(req.query);
  const query = req.query;
  s3Client.getObject(query, (err, data) => {
    if (err) return res.status(400).send("Failed to get object");
    res.send(data);
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

app.listen(process.env.PORT, console.log("server started on 8000"));
