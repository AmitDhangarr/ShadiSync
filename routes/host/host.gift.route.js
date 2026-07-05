import giftController from "../../controllers/host/gift.controller.js";

import { Router } from "express";

class HostGiftRoutes {
  router = null;
  constructor() {
    this.router = Router();
    this.getGuestList();
    this.getCashReceived();
    this.getGuestList();
    this.getItemlist();
    this.getPaymentDetails();
    this.sendThankNote();
    this.getAllRegistry();
    this.getGiftRegistryByGuest();
    this.giftregisteryAsperEvent();
     
  }

  getAllRegistry() {
    this.router.get("/:eventId/all", giftController.getAllRegistry);
  }
  sendThankNote() {
    this.router.post("/:eventId/thanknote/:id", giftController.sendThankYou);
  }
  getItemlist() {
    this.router.get("/:eventId/gifts/items", giftController.getItemList);
  }
  getCashReceived() {
    this.router.get("/:eventId/cash", giftController.getCashReceived);
  }
  getGuestList() {
    this.router.get("/:eventId/guests", giftController.getGuestList);
  }
  getPaymentDetails() {
    this.router.get("/:eventId/payment/:id", giftController.getPaymentDetails);
  }
  getGiftRegistryByGuest() {
    this.router.get("/:eventId/guest/:guestname", giftController.getGiftRegistryByGuest);
  }
   giftregisteryAsperEvent(){
   this.router.get("/",giftController.HandleGiftRegistryAsperEvent);
  }
}

export default new HostGiftRoutes().router;
