import EVENT from "../models/host/event/event.modal.js";
import { nanoid } from "nanoid";
class HostEventController {
  static async HandleCreateEvent(req, res) {
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
        message: "event has been not created",
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
      if (events) {
        return res.status(200).json({
          success: true,
          data: events,
          message: "all events have been fetched successfully.",
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: error,
        message: "events have been not fetched",
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
      }
      return res.status(404).json({
        success: false,
        message: "event not found",
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: error,
        message: "event has not been updated",
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
      }
    } catch (error) {
      return res.status(200).json({
        success: true,
        error: error,
        message: "event has not been deleted",
      });
    }
  }
}

export default HostEventController;
