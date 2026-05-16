
import { Router } from "express";
import GuestGiftController from "../../controllers/guest/guest.gift.controller.js";
import GiftValidator from "../../validator/gift.validator.js";
class GuestGiftRoute {
  router = null;

  constructor() {
    this.router = Router();
    this.createGiftRegistry();
    this.getAllGiftRegistry();
    this.getGiftRegistry();
    this.updateGiftRegistry();
    this.deleteGiftRegistry();
   
  }
  createGiftRegistry() {
    this.router.post("/:event_id/",GiftValidator.HandleGiftCreation,GuestGiftController.HandleCreateGiftRegistry);
  }
  getGiftRegistry() {
    this.router.get("/:id",GuestGiftController.HandlegetGiftRegistry);
  }
  getAllGiftRegistry() {
    this.router.get("/all",GuestGiftController.HandlegetAllGiftRegistry);
  }
  updateGiftRegistry() {
    this.router.patch("/:id",GiftValidator.HandleGiftUpdation,GuestGiftController.HandleupdateGiftRegistry);
  }
  deleteGiftRegistry() {
    this.router.delete("/:id",GuestGiftController.HandledeleteGiftRegistry);
  }
}

export default new GuestGiftRoute().router;
