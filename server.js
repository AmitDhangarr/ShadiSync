import express from "express";
import dotenv from "dotenv";
import { DBconnection } from "./database/db.js";
import userRoute from "./routes/user.route.js";
import bodyParser from "body-parser";
class StartServer {
  app = express();
  port = null;

  constructor() {
    this.setConfiguration();
    this.setRoutes();
    this.start();
    this.setMongoConnection();
  }
  setConfiguration() {
    dotenv.config({ path: "./.env" });
    this.port = process.env.PORT;
    this.connection = process.env.MONGODBURL;
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
  start() {
    this.app.listen(this.port, () =>
      console.log(`server is running at ${this.port}`),
    );
  }
  setRoutes() {
    this.app.get("/", (req, res) => {
      res.json({ success: "successful",message:"welcome to ShadiSync Management System" });
    });
    this.app.use("/user", userRoute);
  }
  setMongoConnection() {
    const connection = DBconnection(this.connection);
    connection
      .then(() => {
        console.log("MongoDB connected Successfully");
      })
      .catch((err) => {
        console.log("MongoDB is not connected", err);
      });
  }
};

new StartServer();
