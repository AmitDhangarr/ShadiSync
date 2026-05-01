import express from "express";
import dotenv from "dotenv";
import { DBconnection } from "./database/db.js";
import userRoute from "./routes/user.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import AuthMiddleware from "./middlewares/auth.middleware.js";
import UserAuthorisation from "./middlewares/authorisation.middleware.js";
import hostRoute from "./routes/host/host.route.js";
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
    this.app.use(cookieParser());
  }
  start() {
    this.app.listen(this.port, () =>
      console.log(`server is running at ${this.port}`),
    );
  }
  setRoutes() {
    this.app.use("/",userRoute);
    this.app.use("/host",AuthMiddleware.AuthUser,UserAuthorisation.checkRole,hostRoute);
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
}

new StartServer();
