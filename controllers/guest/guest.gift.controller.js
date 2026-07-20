import GIFT from "../../models/host/gift/gifts.modal.js";
import EVENT from "../../models/host/event/event.modal.js";
import { nanoid } from "nanoid";
const ALLOWED_FIELDS = [
  "guest_name",
  "guest_family",
  "mobile_number",
  "gift_type",
  "shagun_amount",
  "gift_item_name",
  "gift_description",
  "payment_mode",
  "transaction_reference",
  "notes",
  "photo",
];

class GuestGiftController {
  static async HandleCreateGiftRegistry(req, res) {
    const filename = req.file?.location || "www.image.com"; 
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found. Please check the Event ID.",
        });
      }

      const {
        guest_name,
        guest_family,
        mobile_number,
        gift_type,
        shagun_amount,
        gift_item_name,
        gift_description,
        function_name,
        payment_mode,
        transaction_reference,
        envelope_number,
        received_by,
        received_at,
        photo,
        notes,
        thank_you_sent,
        return_gift_given,
      } = req.body || {};

      const gift = await GIFT.create({
        eventId: id,
        giftId: nanoid(),
        guest_name,
        guest_family,
        mobile_number,
        gift_type,
        shagun_amount,
        gift_item_name,
        gift_description,
        function_name,
        payment_mode,
        transaction_reference,
        envelope_number,
        received_by,
        received_at,
        photo:filename,
        notes,
        thank_you_sent,
        return_gift_given,
      });

      if (!gift) {
        return res.status(201).json({
          success: false,
          message: "Gift has not added.",
        });
      }

      return res.status(201).json({
        success: true,
        data: gift,
        message: "Gift added successfully.",
      });
    } catch (error) {

      if (error && error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "Gift with ID already exits. Please try new one.",
        });
      }
    
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetGiftRegistry(req, res) {
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

      return res.status(200).json({
        success: true,
        data: gift,
        message: "Gift fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetAllGiftRegistry(req, res) {
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
        success: false,
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

  static async HandleupdateGiftRegistry(req, res) {
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

      const filteredUpdates = {};
      ALLOWED_FIELDS.forEach((field) => {
        if (req.body[field] !== undefined) {
          filteredUpdates[field] = req.body[field];
        }
      });

      const updatedGift = await GIFT.findByIdAndUpdate(
        gift._id,
        filteredUpdates,
      );

      if (!updatedGift) {
        return res.status(404).json({
          success: false,
          message: "Gift not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedGift,
        message: "Gift updated successfully.",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandledeleteGiftRegistry(req, res) {
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

      const deletedGift = await GIFT.findByIdAndDelete(gift._id);

      if (!deletedGift) {
        return res.status(404).json({
          success: false,
          message: "Gift not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: gift,
        message: "Gift deleted successfully.",
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
          description: "No events found for gifts",
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

export default GuestGiftController;
