import EVENT from "../../models/host/event/event.modal.js";

const EVENT_PROJECTION = {
  eventId: 1,
  event: 1,
  eventDate: 1,
  eventTime: 1,
  eventVenue: 1,
  foodItems: 1,
  photography: 1,
  status: 1,
};

class GuestEventController {
  static async HandlegetEvent(req, res) {
    try {
      const event = await EVENT.findOne({ eventId: req.params.id }, EVENT_PROJECTION);

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

  static async HandlegetEvents(req, res) {
    try {
      const events = await EVENT.find({}, EVENT_PROJECTION);

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

  static async HandlegetEventUpcoming(req, res) {
    try {
      const events = await EVENT.find({ status: "upcoming" }, EVENT_PROJECTION);

      return res.status(200).json({
        success: true,
        data: events,
        message: events.length === 0 ? "No upcoming events found." : "Upcoming events fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetEventCompleted(req, res) {
    try {
      const events = await EVENT.find({ status: "completed" }, EVENT_PROJECTION);

      return res.status(200).json({
        success: true,
        data: events,
        message: events.length === 0 ? "No completed events found." : "Completed events fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetEventCancelled(req, res) {
    try {
      const events = await EVENT.find({ status: "cancelled" }, EVENT_PROJECTION);

      return res.status(200).json({
        success: true,
        data: events,
        message: events.length === 0 ? "No cancelled events found." : "Cancelled events fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export default GuestEventController;