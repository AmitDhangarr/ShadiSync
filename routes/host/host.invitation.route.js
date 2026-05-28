import { Router } from "express";
import HostInvitationController from "../../controllers/host/host.invitation.controller.js";
import InvitationValidator from "../../validator/invitation.validator.js";
class HostInvitationRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.createInvitation();
    this.getInvitations();
    this.getInvitation();
    this.deleteInvitation();
    this.updateInvitation();
    this.invitationTracking();
  }
   invitationTracking(){
    this.router.get("/tracking",HostInvitationController.HandleInvitationTracking);
   }
  createInvitation() {
    this.router.post(
      "/",
      InvitationValidator.ValidateCreateInvitation,
      HostInvitationController.HandlecreateInvitation,
    );
  }
  getInvitation() {
    this.router.get("/:id", HostInvitationController.HandlegetInvitation);
  }
  getInvitations() {
    this.router.get("/", HostInvitationController.HandlegetInvitations);
  }
  updateInvitation() {
    this.router.patch(
      "/:id",
      InvitationValidator.ValidateUpdateInvitation,
      HostInvitationController.HandleupdateInvitation,
    );
  }
  deleteInvitation() {
    this.router.delete("/:id", HostInvitationController.HandledeleteInvitation);
  }
}

export default new HostInvitationRoute().router;
