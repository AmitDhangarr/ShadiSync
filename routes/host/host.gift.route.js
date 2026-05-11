import giftController from "../../controllers/host/gift.controller.js";

import { Router } from "express";

class HostGiftRoutes {
  router = null;
  constructor() {
    this.router = Router();
    this.getAllRegistry();
    this.getGuestList();
    this.getCashReceived();
    this.getGiftRegistry();
    this.getGuestList();
    this.getItemlist();
    this.getPaymentDetails();
    this.getGiftRegistryByEvent();
    this.getGiftRegistryByGuest();
  }
  getGiftRegistry() {
    this.router.get("/:id", giftController.getGiftRegistry);
  }
  getAllRegistry() {
    this.router.get("/gifts", giftController.getAllRegistry);
  }
  sendThankNote() {
    this.router.post("/thanknote", giftController.sendThankYou);
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
    this.router.get("/:id", giftController.getGiftRegistryByEvent);
  }
  getGiftRegistryByGuest() {
    this.router.get("/:guestname", giftController.getGiftRegistryByGuest);
  }
}

export default new HostGiftRoutes().router;
