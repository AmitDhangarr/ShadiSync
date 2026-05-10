import INVITATION from "./../../models/host/Invitation/invitation.modal.js";
class GuestInvitationController {
  static async handleGetInvitation(req, res) {
    try {
      const id = req.params.id;
      const invitation = await INVITATION.findOne({ InviteId: id });
      if (invitation) {
        return res.status(200).json({
          success: true,
          data: invitation,
          message: "invitation has been successfully fetched",
        });
      }

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: "inviteId is not valid",
          message: "invitation has not fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  static async handleGetInvitations(req, res) {
    try {
      const id = req.params.id;
      const invitations = await INVITATION.find({});
      if (invitations) {
        return res.status(200).json({
          success: true,
          data: invitations,
          message: "invitations have been successfully fetched",
        });
      }

      if (!invitations) {
        return res.status(404).json({
          success: false,
          error: "something went wrong",
          message: "invitation have not fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  static async handleRespondToInvitation(req, res) {
    try {
      const id = req.params.id;
      const { acceptance } = req.body;

      const allowed = ["accepted", "not accepted"];

      if (!acceptance || !allowed.includes(acceptance)) {
        return res.status(400).json({
          success: false,
          error: "Invalid acceptance value",
          message: "Provide a valid acceptance status",
        });
      }

      const invitation = await INVITATION.findOneAndUpdate(
        { InviteId: id },
        {
          $set: { acceptance },
        },
        { new: true },
      );

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: "Invalid InviteId",
          message: "Invitation not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Invitation successfully updated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server error",
      });
    }
  }

  static async handleGetInvitationsByEvent(req, res) {
    try {
      const eventName = req.params.event;
      const invitation = await INVITATION.findOne({ event: eventName });
      if (invitation) {
        return res.status(200).json({
          success: true,
          data: invitation,
          message: "invitation by event has been successfully fetched",
        });
      }

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: "event is not valid",
          message: "invitation by event has not fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  static async handleGetEventChiefGuests(req, res) {
    try {
      const eventName = req.params.event;
      const chiefguest = await INVITATION.findOne(
        { event: eventName },
        { chiefGuest: 1 },
      );

      if (chiefguest) {
        return res.status(200).json({
          success: true,
          data: chiefguest,
          message: "chiefguest has been successfully fetched",
        });
      }

      if (!chiefguest) {
        return res.status(404).json({
          success: false,
          error: "chiefguest has not been made",
          message: "chiefguest has not fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  // this is onhold

  static async handleGetInviter(req, res) {
    try {
      const invitation = await INVITATION.findOne({});
      if (invitation) {
        return res.status(200).json({
          success: true,
          data: invitation,
          message: "invitation has been successfully fetched",
        });
      }

      if (!invitation) {
        return res.status(404).json({
          success: false,
          error: "inviteId is not valid",
          message: "invitation has not fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
}

export default GuestInvitationController;
