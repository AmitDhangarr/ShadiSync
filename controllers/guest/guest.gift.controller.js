import GIFT from "../../models/host/gift/gifts.modal.js";
class GuestGiftController {
  static async HandleCreateGiftRegistry(req, res) {
    try {
      const data = req.body;
      const eventId = req.params.eventId;
      const gift = await GIFT.create({
        event_id: eventId,
        ...data,
      });

      if (gift) {
        return res.status(201).json({
          success: true,
          data: gift,
          message: "gift has been added",
        });
      }
      if (!gift) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while adding gift",
          message: "gift has not been added",
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
  static async HandlegetGiftRegistry(req, res) {
    try {
      const id = req.params.id;
      const gift = await GIFT.findOne({ _id: id });

      if (gift) {
        return res.status(200).json({
          success: true,
          data: gift,
          message: "gift has been fetched successfully",
        });
      }
      if (!gift) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching gift",
          message: "gift has not been fetched",
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
  static async HandlegetAllGiftRegistry(req, res) {
    try {
      const gift = await GIFT.find({});

      if (gift) {
        return res.status(200).json({
          success: true,
          data: gift,
          message: "gifts have been fetched successfully",
        });
      }
      if (!gift) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching gift",
          message: "gifts have not been fetched",
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

  static async HandleupdateGiftRegistry(req, res) {
    try {
      const id = req.params.id;
      const updates = req.body;

      // only these fields can be edited by guest
      const allowedFields = [
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

      // filter only allowed fields
      const filteredUpdates = {};

      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          filteredUpdates[field] = updates[field];
        }
      });

      const updatedGift = await GIFT.findByIdAndUpdate(
        { _id: id },
        filteredUpdates,
      );

      if (!updatedGift) {
        return res.status(404).json({
          success: false,
          message: "Gift not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedGift,
        message: "Gift updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server error",
      });
    }
  }

  static async HandledeleteGiftRegistry(req, res) {
    try {
      const data = req.body;
      const id = req.params.id;
      const gift = await GIFT.findOneAndDelete({ _id: id });
      if (gift) {
        return res.status(200).json({
          success: true,
          data: gift,
          message: "gift has been deleted",
        });
      }
      if (!gift) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while deleting gift",
          message: "gift has not been deleted",
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
}

export default GuestGiftController;
