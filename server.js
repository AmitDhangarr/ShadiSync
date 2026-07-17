import express from "express";
import dotenv from "dotenv";
import { DBconnection } from "./database/db.js";
import userRoute from "./routes/user.route.js";
import rootRoute from "./routes/root.route.js";
import authRoute from "./routes/auth.route.js";
import financialRoute from "./routes/host/expense.root.route.js";
import hostrootRoute from "./routes/host/host.root.route.js";
import hostDashboardRoute from "./routes/host/dashboards/dashboard.root.route.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthMiddleware from "./middlewares/auth.middleware.js";
import UserAuthorisation from "./middlewares/authorisation.middleware.js";
import hostRoute from "./routes/host/host.route.js";
import GuestRoute from "./routes/guest/guest.route.js";
import rateLimit from "express-rate-limit";
import path from "path";
import docsRoute from "./routes/docs.route.js";


// cors configuration
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-KEY"],
};

// rate limiting config

const ratelimitConfig = {
  windowMs: 5 * 60 * 1000,
  max: (req, res) => {
    if (req.cookies?.token || req.headers["authorization"]) return 50;
    return 20;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests. Limit is 5-20 per minute.",
  },
};

class StartServer {
  app = express();
  port = null;
  apirateLimit = null;

  constructor() {
    this.setConfiguration();
    this.setMongoConnection();
    this.setRoutes();
    this.start();
  }
  setConfiguration() {
    dotenv.config({ path: "./.env" });
    this.port = process.env.PORT;
    this.connection = process.env.MONGODBURL;
    this.app.use(cors(corsOptions));
    this.app.use(cookieParser());
    this.apirateLimit = rateLimit(ratelimitConfig);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.set('views',path.join('views'));
    this.app.set('view engine','ejs');
  }
  start() {
    this.app.listen(this.port, () =>{
      console.log(`server is running at ${this.port}`,"0.0.0.0");}
    );
  }
  setRoutes() {
    this.app.use("/api/v1/", this.apirateLimit);
    this.app.use("/api/v1/auth", userRoute);
    this.app.use(
      "/api/v1/host",
      AuthMiddleware.AuthUser,
      UserAuthorisation.checkRole,
      hostRoute,
    );
    
    this.app.use("/api/v1/guest", AuthMiddleware.AuthUser, GuestRoute);

    // fallback routes
    this.app.get("/api/v1/host/expense",financialRoute);
    this.app.get("/api/v1/host/dashboard",hostDashboardRoute);
    this.app.get("/api/v1/host",hostrootRoute);
    this.app.get("/api/v1/auth", authRoute);
    this.app.get("/api/v1/docs", docsRoute);
    this.app.get("/api/v1/", rootRoute);
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
