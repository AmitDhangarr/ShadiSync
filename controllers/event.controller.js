import EVENT from "../models/host/event/event.modal.js";
import { nanoid } from "nanoid";
class HostEventController {
  static async HandleCreateEvent(req, res) {
    try {
      const data = req.body;
      const EventId = nanoid();
      const event = await EVENT.create({
        eventId: EventId,
        ...data,
      });

      if (event) {
        return res.status(200).json({
          success: true,
          message: "event has been created",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "error while creating event",
          message: "event has been not created",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
  static async HandleGetEvent(req, res) {
    try {
      const uniqueId = req.params.id;
      const event = await EVENT.findOne({ eventId: uniqueId });

      if (event) {
        return res.status(200).json({
          success: true,
          data: event,
          message: "event has been fetched successfully",
        });
      } else {
        return res.status(200).json({
          success: false,
          error: "eventId is not valid",
          message: "event has not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
  static async HandleGetEvents(req, res) {
    try {
      const events = await EVENT.find(
        {},
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventVenue: 1,
          budget: 1,
          expense: 1,
        },
      );

      if (events.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "there is no event yet",
        });
      }
      if (events) {
        return res.status(200).json({
          success: true,
          data: events,
          message: "all events have been fetched successfully.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "fetch failed",
          message: "events have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
  static async HandleUpdateEvent(req, res) {
    try {
      const updatedData = req.body;
      const uniqueID = req.params?.id;
      const updatedEvent = await EVENT.findOneAndUpdate(
        { eventId: uniqueID },
        { $set: updatedData },
      );
      if (updatedEvent) {
        return res.status(200).json({
          success: true,
          message: "event has been updated",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "eventId is not found",
          message: "event has not updated",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
  static async HandleDeleteEvent(req, res) {
    try {
      const uniqueID = req.params?.id;
      const deletedEvent = await EVENT.findOneAndDelete({ eventId: uniqueID });
      if (deletedEvent) {
        return res.status(200).json({
          success: true,
          message: "event has been deleted successfully",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: "eventId is not found",
          message: "event has not been deleted",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
}

export default HostEventController;
