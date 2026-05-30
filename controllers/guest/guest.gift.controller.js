import GIFT from "../../models/host/gift/gifts.modal.js";

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
    const filename = req.file?.filename || "www.image.com";
    try {
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
      } = req.body;

      const gift = await GIFT.create({
        event_id: req.params.event_id,
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

      return res.status(201).json({
        success: true,
        data: gift,
        message: "Gift added successfully.",
      });
    } catch (error) {
      console.error("Gift creation error:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandlegetGiftRegistry(req, res) {
    try {
      const gift = await GIFT.findById(req.params.id);

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
      const gifts = await GIFT.find({});

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

  static async HandleupdateGiftRegistry(req, res) {
    try {
      const filteredUpdates = {};
      ALLOWED_FIELDS.forEach((field) => {
        if (req.body[field] !== undefined) {
          filteredUpdates[field] = req.body[field];
        }
      });

      const updatedGift = await GIFT.findByIdAndUpdate(
        req.params.id,
        filteredUpdates,
        { new: true },
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
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async HandledeleteGiftRegistry(req, res) {
    try {
      const gift = await GIFT.findByIdAndDelete(req.params.id);

      if (!gift) {
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
}

export default GuestGiftController;
