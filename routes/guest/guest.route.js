import { Router } from "express";
import UserValidator from "../../validator/user.validator.js";
import GuestEventRoute from "./guest.event.route.js";
import UserController from "../../controllers/user.controller.js";
import guestInvitationRoute from "./guest.invitation.route.js";
class GuestRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.Event();
    this.Invitation();
    this.Expense();
    this.Gift();
  }
  Event() {
    this.router.use("/event", GuestEventRoute);
  }
  Invitation() {
    this.router.use(
      "/invitation",
      guestInvitationRoute
    );
  }
  Expense() {
    this.router.use("/expense", UserController.HandleUpdateUser);
  }
  Gift() {
    this.router.use("/gift", UserController.HandleUpdateUser);
  }
}
export default new GuestRoute().router;
