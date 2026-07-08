import { Router } from "express";
import GuestInvitationController from "../../controllers/guest/guest.invitation.controller.js";
import InvitationValidator from "../../validator/invitation.validator.js";

class GuestInvitationRoutes {
  router = null;

  constructor() {
    this.router = Router();
    this.getInvitations();
    this.getInviterDetails();
    this.responsetoInvitation();
    this.getChiefGuest();
    this.getInvitationByEvent();
    this.getInvitation();
  }

  getInvitations() {
    this.router.get("/all", GuestInvitationController.handleGetInvitations);
  }

  getInviterDetails() {
    this.router.get("/inviter", GuestInvitationController.handleGetInviter);
  }

  responsetoInvitation() {
    this.router.patch(
      "/response/:id",
      GuestInvitationController.handleRespondToInvitation,
    );
  }

  getChiefGuest() {
    this.router.get(
      "/:eventId/chiefguest",
      GuestInvitationController.handleGetEventChiefGuests,
    );
  }

  getInvitationByEvent() {
    this.router.get(
      "/:eventId",
      GuestInvitationController.handleGetInvitationsByEvent,
    );
  }

  getInvitation() {
    this.router.get(
      "/invite/:id",
      GuestInvitationController.handleGetInvitation,
    );
  }
}

export default new GuestInvitationRoutes().router;
