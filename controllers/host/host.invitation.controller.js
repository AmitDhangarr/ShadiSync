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
        message:
          invitations.length === 0
            ? "No invitations found."
            : "Invitations fetched successfully.",
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
      const invitation = await INVITATION.findOneAndDelete({
        InviteId: req.params.id,
      });

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
  static async HandleInvitationTracking(req, res) {
    try {
      const acceptedInvitations = await INVITATION.find(
        {
          acceptance: "accepted",
        },
        {
          _id: 1,
          InviteId: 1,
          event: 1,
          acceptance: 1,
          date: 1,
          receiverNote: 1,
        },
      );

      if (!acceptedInvitations) {
        return res.status(404).json({
          success: false,
          message:
            "something went wrong ! while fetching the accepted track records",
        });
      }
      const notacceptedInvitations = await INVITATION.find(
        {
          acceptance: "not accepted",
        },
        {
          _id: 1,
          InviteId: 1,
          event: 1,
          acceptance: 1,
          date: 1,
          receiverNote: 1,
        },
      );

      if (!notacceptedInvitations) {
        return res.status(404).json({
          success: false,
          message:
            "something went wrong ! while fetching the not-accepted track records",
        });
      }
      const pendingacceptance = await INVITATION.find(
        {
          acceptance: "pending",
        },
        {
          _id: 1,
          InviteId: 1,
          event: 1,
          acceptance: 1,
          date: 1,
          receiverNote: 1,
        },
      );

      if (!pendingacceptance) {
        return res.status(404).json({
          success: false,
          message:
            "something went wrong ! while fetching the pending acceptance track records",
        });
      }
      return res.status(200).json({
        success: true,
        data: [
          {
            acceptedInvitations: acceptedInvitations,
            notacceptedInvitations: notacceptedInvitations,
            pendingInvitation: pendingacceptance,
          },
        ],
        message: "invitation Tracking has been fetched successfully.",
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
