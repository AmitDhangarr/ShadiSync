import { nanoid } from "nanoid";
import INVITATION from "../../models/host/Invitation/invitation.modal.js";
import EVENT from "../../models/host/event/event.modal.js";
class HostInvitationController {
  static async HandleInvitationBasedonEvent(req, res) {
    try {
      const events = await EVENT.find(
        {},
        { eventId: 1, event: 1, eventDate: 1, status: 1 },
      );

      if (!events) {
        return res.status(404).json({
          success: false,
          message: "ShaadiSync Invitation Gateway",
          description: "No events found for invitation",
          status: "healthy",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "ShaadiSync Invitation Gateway",
        description: "Invitation based on events",
        status: "healthy",
        data: events,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlecreateInvitation(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const invite = await INVITATION.create({
        eventId: id,
        InviteId: nanoid(),
        ...req.body,
      });

      if (!invite) {
        return res.status(404).json({
          success: false,
          message: "Invitation creation failed.",
        });
      }

      return res.status(201).json({
        success: true,
        data: invite,
        message: "Invitation created successfully.",
      });
    } catch (error) {

      if (error && error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "Invitation with ID already exits. Please try new one.",
        });
      }

      return res.status(500).json({
        success: false,
        error: error,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetInvitation(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const invitation = await INVITATION.findOne({ InviteId: req.params.id ,eventId:id });

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
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const invitations = await INVITATION.find({eventId:id});

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
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const invitation = await INVITATION.findOneAndUpdate(
        { InviteId: req.params.id,eventId:id },
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
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

       const role = req.user.payload.role;

      if (role === "co-host") {
        return res.status(401).json({
          success: false,
          message: "Co-host is not allowed to perform delete operation",
        });
      }

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

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
       const id = req.params.eventId
      const event = await EVENT.findOne({ eventId:id});

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
    
      const acceptedInvitations = await INVITATION.find(
        {
          acceptance: "accepted",
        },
        {
          _id: 1,
          eventId:1,
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
