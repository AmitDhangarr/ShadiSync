import { Router } from "express";
import HostInvitationController from "../../controllers/host/host.invitation.controller.js";
import InvitationValidator from "../../validator/invitation.validator.js";
class HostInvitationRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.createInvitation();
    this.getInvitation();
    this.deleteInvitation();
    this.updateInvitation();
    this.invitationTracking();
    this.getInvitations();
    this.invitationbasedOnEvent();
  }

  invitationbasedOnEvent(){
   this.router.get("/",HostInvitationController.HandleInvitationBasedonEvent);
  }
   invitationTracking(){
    this.router.get("/:eventId/invitees/tracking",HostInvitationController.HandleInvitationTracking);
   }
  createInvitation() {
    this.router.post(
      "/:eventId",
      InvitationValidator.ValidateCreateInvitation,
      HostInvitationController.HandlecreateInvitation,
    );
  }
  getInvitation() {
    this.router.get("/:eventId/invitee/:id", HostInvitationController.HandlegetInvitation);
  }
  getInvitations() {
    this.router.get("/:eventId/invitees/all", HostInvitationController.HandlegetInvitations);
  }
  updateInvitation() {
    this.router.patch(
      "/:eventId/invitee/:id",
      InvitationValidator.ValidateUpdateInvitation,
      HostInvitationController.HandleupdateInvitation,
    );
  }
  deleteInvitation() {
    this.router.delete("/:eventId/invitee/:id", HostInvitationController.HandledeleteInvitation);
  }
}

export default new HostInvitationRoute().router;
