import { Router } from "express";
import EventValidator from "../../validator/event.validator.js";
import HostEventController from "../../controllers/event.controller.js";
class HostEventRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.CreateEvent();
    this.GetEvents();
    this.UpdateEvent();
    this.DeleteEvent();
  }
  CreateEvent() {
    this.router.post("/",EventValidator.validateCreateEvent,HostEventController.HandleCreateEvent);
  }
  GetEvents() {
    this.router.get("/",HostEventController.HandleGetEvents);
  }
  UpdateEvent() {
    this.router.patch("/:id",EventValidator.validateUpdateEvent,HostEventController.HandleUpdateEvent);
  }
  DeleteEvent() {
    this.router.delete("/:id",HostEventController.HandleDeleteEvent);
  }
}
 export default new HostEventRoute().router;
