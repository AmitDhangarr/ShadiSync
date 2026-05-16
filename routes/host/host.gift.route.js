import giftController from "../../controllers/host/gift.controller.js";

import { Router } from "express";

class HostGiftRoutes {
  router = null;
  constructor() {
    this.router = Router();
    this.getAllRegistry();
    this.getGuestList();
    this.getCashReceived();
    this.getGuestList();
    this.getItemlist();
    this.getGiftRegistry();
    this.getPaymentDetails();
    this.getGiftRegistryByEvent();
    this.getGiftRegistryByGuest();
    this.sendThankNote();
     
  }
  getGiftRegistry() {
    this.router.get("/:id", giftController.getGiftRegistry);
  }
  getAllRegistry() {
    this.router.get("/gifts", giftController.getAllRegistry);
  }
  sendThankNote() {
    this.router.post("/thanknote/:id", giftController.sendThankYou);
  }
  getItemlist() {
    this.router.get("/gifts/items", giftController.getItemList);
  }
  getCashReceived() {
    this.router.get("/cash", giftController.getCashReceived);
  }
  getGuestList() {
    this.router.get("/guests", giftController.getGuestList);
  }
  getPaymentDetails() {
    this.router.get("/payment/:id", giftController.getPaymentDetails);
  }
  getGiftRegistryByEvent() {
    this.router.get("/event/:event_id", giftController.getGiftRegistryByEvent);
  }
  getGiftRegistryByGuest() {
    this.router.get("/guest/:guestname", giftController.getGiftRegistryByGuest);
  }
}

export default new HostGiftRoutes().router;
