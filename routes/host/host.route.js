import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import UserValidator from "../../validator/user.validator.js";
import HostEventRoute from "./host.event.route.js";
import HostInvitationRoute from "./host.invitation.route.js";
import HostGiftRoute from "./host.gift.route.js";
class HostRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.Event();
    this.Invitation();
    this.Expense();
    this.Gift();
  }
  Event() {
    this.router.use("/event", HostEventRoute);
  }
  Invitation() {
    this.router.use("/invitation", HostInvitationRoute);
  }
  Expense() {
    this.router.use("/expense", userController.HandleUpdateUser);
  }
  Gift() {
    this.router.use("/gift", HostGiftRoute);
  }
}
export default new HostRoute().router;
