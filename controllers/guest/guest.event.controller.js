import EVENT from "../../models/host/event/event.modal.js";
class GuestEventController {
  static async HandlegetEvent(req, res) {
    try {
      const uniqueId = req.params.id;
      const event = await EVENT.findOne(
        { eventId: uniqueId },
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventTime: 1,
          eventVenue: 1,
          foodItems: 1,
          photography: 1,
          status: 1,
        },
      );

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

  static async HandlegetEvents(req, res) {
    try {
      const events = await EVENT.find(
        {},
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventTime: 1,
          eventVenue: 1,
          foodItems: 1,
          photography: 1,
          status: 1,
        },
      );

      if (events.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "there is no event yet",
        });
      }
      return res.status(200).json({
        success: true,
        data: events,
        message: "all events have been fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  static async HandlegetEventUpcoming(req, res) {
    try {
      const events = await EVENT.find(
        { status: "upcoming" },
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventTime: 1,
          eventVenue: 1,
          foodItems: 1,
          photography: 1,
          status: 1,
        },
      );

      if (events.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "there is no event yet",
        });
      }
      return res.status(200).json({
        success: true,
        data: events,
        message: "all events have been fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  static async HandlegetEventCompleted(req, res) {
    try {
      const events = await EVENT.find(
        { status: "completed" },
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventTime: 1,
          eventVenue: 1,
          foodItems: 1,
          photography: 1,
          status: 1,
        },
      );

      if (events.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "there is no event yet",
        });
      }
      return res.status(200).json({
        success: true,
        data: events,
        message: "all events have been fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }

  static async HandlegetEventCancelled(req, res) {
    try {
      const events = await EVENT.find(
        { status: "cancelled" },
        {
          eventId: 1,
          event: 1,
          eventDate: 1,
          eventTime: 1,
          eventVenue: 1,
          foodItems: 1,
          photography: 1,
          status: 1,
        },
      );

      if (events.length === 0) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "there is no event yet",
        });
      }
      return res.status(200).json({
        success: true,
        data: events,
        message: "all events have been fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "internal server error",
      });
    }
  }
}

export default GuestEventController;
