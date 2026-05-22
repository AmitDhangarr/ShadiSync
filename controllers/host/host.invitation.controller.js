import { nanoid } from "nanoid";
import INVITATION from "../../models/host/Invitation/invitation.modal.js";

class HostInvitationController {
  static async HandlecreateInvitation(req, res) {
    try {
      const invite = await INVITATION.create({
        InviteId: nanoid(),
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        data: invite,
        message: "Invitation created successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetInvitation(req, res) {
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

  static async HandlegetInvitations(req, res) {
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

  static async HandleupdateInvitation(req, res) {
    try {
      const invitation = await INVITATION.findOneAndUpdate(
        { InviteId: req.params.id },
        { ...req.body },
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
        message: "Invitation updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandledeleteInvitation(req, res) {
    try {
      const invitation = await INVITATION.findOneAndDelete({ InviteId: req.params.id });

      if (!invitation) {
        return res.status(404).json({
          success: false,
          message: "Invitation not found. Please check the invite ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: invitation,
        message: "Invitation deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export default HostInvitationController;