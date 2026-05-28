import INVITATION from "./../../models/host/Invitation/invitation.modal.js";

const ALLOWED_ACCEPTANCE = ["accepted", "not accepted"];

class GuestInvitationController {
  static async handleGetInvitation(req, res) {
    try {
      const invitation = await INVITATION.findOne({ InviteId: req.params.id });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: "Invitation not found. Please check the invite ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Invitation fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetInvitations(req, res) {
    try {
      const invitations = await INVITATION.find({});

      return res.status(200).json({
        success: true,
        data: invitations,
        message: invitations.length === 0 ? "No invitations found." : "Invitations fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleRespondToInvitation(req, res) {
    try {
      const { acceptance,receiverNote } = req.body;

      if (!acceptance || !ALLOWED_ACCEPTANCE.includes(acceptance)) {
        return res.status(400).json({
          success: false,
          message: "Invalid acceptance value. Use 'accepted' or 'not accepted'.",
        });
      }

      
      if (!receiverNote || receiverNote.trim() === " ") {
        return res.status(400).json({
          success: false,
          message: "Note is mandatory",
        });
      }

      const invitation = await INVITATION.findOneAndUpdate(
        { InviteId: req.params.id },
        { $set: { acceptance ,receiverNote} },
        { new: true },
      );

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: "Invitation not found. Please check the invite ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Invitation response submitted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetInvitationsByEvent(req, res) {
    try {
      const invitation = await INVITATION.findOne({ event: req.params.event });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: "No invitation found for this event.",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Invitation fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetEventChiefGuests(req, res) {
    try {
      const chiefguest = await INVITATION.findOne(
        { event: req.params.event },
        { chiefGuest: 1 },
      );

      if (!chiefguest) {
        return res.status(404).json({
          success: false,
          message: "No chief guest found for this event.",
        });
      }

      return res.status(200).json({
        success: true,
        data: chiefguest,
        message: "Chief guest fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  // on hold
  static async handleGetInviter(req, res) {
    try {
      const invitation = await INVITATION.findOne({});

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: "Inviter not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Inviter fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export default GuestInvitationController;