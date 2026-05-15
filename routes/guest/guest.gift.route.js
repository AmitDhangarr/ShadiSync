
import { Router } from "express";
import GuestGiftController from "../../controllers/guest/guest.gift.controller.js";
import GiftValidator from "../../validator/gift.validator.js";
class GuestGiftRoute {
  router = null;

  constructor() {
    this.router = Router();
    this.createGiftRegistry();
    this.getAllGiftRegistry();
    this.updateGiftRegistry();
    this.deleteGiftRegistry();
   
  }
  createGiftRegistry() {
    this.router.post("/:eventId/",GiftValidator.HandleGiftCreation,GuestGiftController.HandleCreateGiftRegistry);
  }
  getGiftRegistry() {
    this.router.get("/:id",GuestGiftController.HandlegetGiftRegistry);
  }
  getAllGiftRegistry() {
    this.router.get("/gifts",GuestGiftController.HandlegetAllGiftRegistry);
  }
  updateGiftRegistry() {
    this.router.patch("/update/:id",GuestGiftController.HandleupdateGiftRegistry);
  }
  deleteGiftRegistry() {
    this.router.delete("/delete/:id",GuestGiftController.HandledeleteGiftRegistry);
  }
}

export default new GuestGiftRoute().router;
