import { nanoid } from "nanoid";
import INVITATION from "../../models/host/Invitation/invitation.modal.js";
class HostInvitationController {
  static async HandlecreateInvitation(req, res) {
    try {
      const data = req.body;
      const UniqueId = nanoid();
      const Invite = await INVITATION.create({
        InviteId: UniqueId,
        ...data,
      });

      if (Invite) {
        return res.status(201).json({
          success: true,
          message: "invitation has been send successfully",
        });
      }
      if (!Invite) {
        return res.status(400).json({
          success: false,
          error: "something went wrong",
          message: "invitation failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Internal server error",
      });
    }
  }
  static async HandlegetInvitation(req, res) {
    try {
      const uniqueId = req.params.id;
      const Invitation = await INVITATION.findOne({ InviteId: uniqueId });
      if (Invitation) {
        return res.status(200).json({
          success: true,
          data: Invitation,
          message: "invitation has been fetched successfully",
        });
      }

      if (!Invitation) {
        return res.status(404).json({
          success: false,
          error: "InviteId is not Valid",
          message: "invitation is not found",
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
  static async HandlegetInvitations(req, res) {
    try {
      const Invitations = await INVITATION.find({});
      if (Invitations) {
        return res.status(200).json({
          success: true,
          data: Invitations,
          message: "invitations have been fetched successfully",
        });
      }
      if (!Invitations) {
        return res.status(404).json({
          success: false,
          error: "something went wrong",
          message: "invitations have not fetched successfully",
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
  static async HandleupdateInvitation(req, res) {
    try {
      const data = req.body;
      const uniqueId = req.params.id;
      const Invite = await INVITATION.findOneAndUpdate(
        { InviteId: uniqueId },
        { ...data },
      );

      if (Invite) {
        return res.status(201).json({
          success: true,
          message: "invitation has been updated successfully",
        });
      }
      if (!Invite) {
        return res.status(400).json({
          success: false,
          error: "something went wrong",
          message: "invitation update has failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Internal server error",
      });
    }
  }
  static async HandledeleteInvitation(req, res) {
    try {
      const data = req.body;
      const uniqueId = req.params.id;
      const Invite = await INVITATION.findOneAndDelete({
        InviteId: uniqueId,
      });

      if (Invite) {
        return res.status(201).json({
          success: true,
          message: "invitation has been deleted successfully",
        });
      }
      if (!Invite) {
        return res.status(400).json({
          success: false,
          error: "something went wrong",
          message: "invitation deletion has failed",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Internal server error",
      });
    }
  }
}

export default HostInvitationController;
