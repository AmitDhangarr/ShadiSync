import { Router } from "express";
import GuestGiftController from "../../controllers/guest/guest.gift.controller.js";
import GiftValidator from "../../validator/gift.validator.js";
import upload from "../../middlewares/upload.middleware.js";
class GuestGiftRoute {
  router = null;

  constructor() {
    this.router = Router();
    this.createGiftRegistry();
    this.updateGiftRegistry();
    this.deleteGiftRegistry();
    this.getAllGiftRegistry();
    this.getGiftRegistry();
    this.giftregisteryAsperEvent();
  }
  createGiftRegistry() {
    this.router.post(
      "/:eventId/register",
      GiftValidator.HandleGiftCreation,
      GuestGiftController.HandleCreateGiftRegistry,
    );
  }
  getGiftRegistry() {
    this.router.get("/:eventId/:id", GuestGiftController.HandlegetGiftRegistry);
  }
  getAllGiftRegistry() {
    this.router.get(
      "/:eventId/all",
      GuestGiftController.HandlegetAllGiftRegistry,
    );
  }
  updateGiftRegistry() {
    this.router.patch(
      "/:eventId/:id",
      GiftValidator.HandleGiftUpdation,
      GuestGiftController.HandleupdateGiftRegistry,
    );
  }
  deleteGiftRegistry() {
    this.router.delete(
      "/:eventId/:id",
      GuestGiftController.HandledeleteGiftRegistry,
    );
  }
  giftregisteryAsperEvent() {
    this.router.get("/", GuestGiftController.HandleGiftRegistryAsperEvent);
  }
}

export default new GuestGiftRoute().router;
