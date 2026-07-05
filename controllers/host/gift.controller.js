import GIFT from "../../models/host/gift/gifts.modal.js";
import EVENT from "../../models/host/event/event.modal.js";
class GiftController {
  static async getAllRegistry(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const gifts = await GIFT.find({ eventId: id });

      return res.status(200).json({
        success: true,
        data: gifts,
        message:
          gifts.length === 0
            ? "No gifts found."
            : "Gifts fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async getGuestList(req, res) {
    try {
      const id = req.params.eventId;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
      const guests = await GIFT.find({ eventId: id }, { guest_name: 1 });

      return res.status(200).json({
        success: true,
        data: guests,
        message:
          guests.length === 0
            ? "No guests found."
            : "Guests fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async getCashReceived(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
      const totalCash = await GIFT.aggregate([
        { $match: { gift_type: "Cash" } },
        { $group: { _id: null, totalCash: { $sum: "$shagun_amount" } } },
      ]);

      return res.status(200).json({
        success: true,
        data: totalCash,
        message: "Total cash received fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async getItemList(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
      const items = await GIFT.find({}, { gift_item_name: 1 });

      return res.status(200).json({
        success: true,
        data: items,
        message:
          items.length === 0
            ? "No items found."
            : "Items fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async getPaymentDetails(req, res) {
    try {
      const id = req.params.eventId;
      const gift_id = req.params.id;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
       const gift = await GIFT.findOne({ giftId: gift_id });

      if (!gift) {
        return res.status(404).json({
          success: false,
          message: "Gift not found. Please check the ID.",
        });
      }

      const paymentDetails = await GIFT.findById(gift._id,{
        guest_name: 1,
        payment_mode: 1,
        transaction_reference: 1,
      });

      if (!paymentDetails) {
        return res.status(404).json({
          success: false,
          message: "Payment details not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: paymentDetails,
        message: "Payment details fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async getGiftRegistryByGuest(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }
      const gifts = await GIFT.find({ guest_name: req.params.guestname });

      return res.status(200).json({
        success: true,
        data: gifts,
        message:
          gifts.length === 0
            ? "No gifts found for this guest."
            : "Guest gift registry fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async sendThankYou(req, res) {
    try {
      const id = req.params.eventId;
      const gift_id = req.params.id;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const gift = await GIFT.findOne({ giftId: gift_id });

      if (!gift) {
        return res.status(404).json({
          success: false,
          message: "Gift not found. Please check the ID.",
        });
      }

      const { notes, thank_you_sent } = req.body;

      if (notes === undefined || thank_you_sent === undefined) {
        return res.status(400).json({
          success: false,
          message: "Both 'notes' and 'thank_you_sent' fields are required.",
        });
      }

      if (typeof thank_you_sent !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "'thank_you_sent' must be a boolean.",
        });
      }

      const updatedThanknote = await GIFT.findByIdAndUpdate(
        gift._id,
        { $set: { notes: notes.toString().trim(), thank_you_sent } },
        { new: true },
      );

      if (!updatedThanknote) {
        return res.status(404).json({
          success: false,
          message: "Gift not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: gift,
        message: "Thank you note sent successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
  static async HandleGiftRegistryAsperEvent(req, res) {
    try {
      const events = await EVENT.find(
        {},
        { eventId: 1, event: 1, eventDate: 1, status: 1 },
      );

      if (!events) {
        return res.status(404).json({
          success: false,
          message: "ShaadiSync Gift Gateway",
          description: "No events found for invitation",
          status: "healthy",
          data: [],
        });
      }

      return res.status(200).json({
        success: true,
        message: "ShaadiSync Gift Gateway",
        description: "gift registery based on events",
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
}

export default GiftController;
