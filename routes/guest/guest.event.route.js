import { Router } from "express";
import GuestEventController from "../../controllers/guest/guest.event.controller.js";

class GuestEventRoute {
  router = null;

  constructor() {
    this.router = Router();
    this.getEvents();
    this.getEventUpcoming();
    this.getEventCompleted();
    this.getEventCancelled();
     this.getEvent();
  }
  getEvent() {
    this.router.get("/:id", GuestEventController.HandlegetEvent);
  }
  getEvents() {
    this.router.get("/all", GuestEventController.HandlegetEvents);
  }
  getEventUpcoming() {
    this.router.get(
      "/upcoming",
      GuestEventController.HandlegetEventUpcoming,
    );
  }
  getEventCompleted() {
    this.router.get(
      "/completed",
      GuestEventController.HandlegetEventCompleted,
    );
  }
    getEventCancelled() {
    this.router.get(
      "/cancelled",
      GuestEventController.HandlegetEventCancelled,
    );
  }
}

export default new GuestEventRoute().router;
