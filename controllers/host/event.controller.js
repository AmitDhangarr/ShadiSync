import EVENT from "../../models/host/event/event.modal.js";
import { nanoid } from "nanoid";

class HostEventController {
  static async HandleCreateEvent(req, res) {
    try {
      const event = await EVENT.create({
        eventId: nanoid(),
        userId:req?.user.payload._id,
        ...req.body,
      });

      return res.status(201).json({
        success: true,
        data: event,
        message: "Event created successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error:error,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandleGetEvent(req, res) {
    try {
      const event = await EVENT.findOne({ eventId: req.params.id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the event ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: event,
        message: "Event fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandleGetEvents(req, res) {
    try {
      const events = await EVENT.find({});

      return res.status(200).json({
        success: true,
        data: events,
        message: events.length === 0 ? "No events found." : "Events fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandleUpdateEvent(req, res) {
    try {
      const updatedEvent = await EVENT.findOneAndUpdate(
        { eventId: req.params.id },
        { $set: req.body },
        { new: true },
      );

      if (!updatedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the event ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedEvent,
        message: "Event updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandleDeleteEvent(req, res) {
    try {
      const deletedEvent = await EVENT.findOneAndDelete({ eventId: req.params.id });

      if (!deletedEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the event ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data:deletedEvent.event,
        message: "Event deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export default HostEventController;