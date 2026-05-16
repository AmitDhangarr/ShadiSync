import GIFT from "../../models/host/gift/gifts.modal.js";
class giftController {
  static async getAllRegistry(req, res) {
    try {
      const gifts = await GIFT.findOne({});
      if (gift) {
        return res.status(200).json({
          success: true,
          data: gift,
          message: "gifts have been fetched successfully",
        });
      }
      if (!gifts) {
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

  static async getGuestList(req, res) {
    try {
      const guests = await GIFT.find({}, { guest_name: 1 });

      if (guests) {
        return res.status(201).json({
          success: true,
          data: guests,
          message: "guests have been fetched",
        });
      }
      if (!guests) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching guests",
          message: "guests have not been fetched",
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

  static async getCashReceived(req, res) {
    try {
      const totalCash = await GIFT.aggregate([
        { $match: { gift_type: "Cash" } },
        {
          $group: {
            _id: null,
            totalCash: { $sum: "$shagun_amount" },
          },
        },
      ]);

      if (totalCash) {
        return res.status(201).json({
          success: true,
          data: totalCash,
          message: "totalCash have been fetched",
        });
      }
      if (!totalCash) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching totalCash",
          message: "totalCash have not been fetched",
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

  static async getGiftRegistry(req, res) {
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

  static async getItemList(req, res) {
    try {
      const Items = await GIFT.find({}, { gift_item_name: 1 });

      if (Items) {
        return res.status(201).json({
          success: true,
          data: Items,
          message: "Items have been fetched",
        });
      }
      if (!Items) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching Items",
          message: "Items have not been fetched",
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

  static async getPaymentDetails(req, res) {
    try {
      const id = req.params.id;

      const paymentDetails = await GIFT.findOne(
        { _id: id },
        { guest_name: 1, payment_mode: 1, transaction_reference: 1 },
      );

      if (paymentDetails) {
        return res.status(201).json({
          success: true,
          data: paymentDetails,
          message: "paymentDetails have been fetched",
        });
      }
      if (!paymentDetails) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching paymentDetails",
          message: "paymentDetails have not been fetched",
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

  static async getGiftRegistryByEvent(req, res) {
    try {
      const id = req.params.event_id;

      const GiftRegistryByEvent = await GIFT.find(
        {
          event_id: req.params.event_id,
        },
        {},
      );

      if (GiftRegistryByEvent) {
        return res.status(201).json({
          success: true,
          data: GiftRegistryByEvent,
          message: "GiftRegistryByEvent have been fetched",
        });
      }
      if (!GiftRegistryByEvent) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching GiftRegistryByEvent",
          message: "GiftRegistryByEvent have not been fetched",
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

  static async getGiftRegistryByGuest(req, res) {
    try {
      const guestname = req.params.guestname;

      const GiftRegistrybyGuestName = await GIFT.find(
        { guest_name: guestname },
        {},
      );

      if (GiftRegistrybyGuestName) {
        return res.status(201).json({
          success: true,
          data: GiftRegistrybyGuestName,
          message: "GiftRegistrybyGuestName have been fetched",
        });
      }
      if (!GiftRegistrybyGuestName) {
        return res.status(404).json({
          success: false,
          error: "something went wrong while fetching GiftRegistrybyGuestName",
          message: "GiftRegistrybyGuestName have not been fetched",
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
  static async sendThankYou(req, res) {
    try {
      const id = req.params.id;
      const { notes, thank_you_sent } = req.body;

      if (notes === undefined || thank_you_sent === undefined) {
        return res.status(400).json({
          success: false,
          message: "Both 'notes' and 'thank_you_sent' fields are required",
        });
      }

      if (typeof thank_you_sent !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "'thank_you_sent' must be a boolean",
        });
      }

      const filteredUpdates = {
        notes: notes.toString().trim(),
        thank_you_sent,
      };

      const sendThankNote = await GIFT.findByIdAndUpdate(
        id,
        { $set: filteredUpdates },
      );

      if (sendThankNote) {
        return res.status(201).json({
          success: true,
          data: sendThankNote,
          message: "sendThankNote has been sent",
        });
      }

      return res.status(404).json({
        success: false,
        error: "something went wrong while sending sendThankNote",
        message: "sendThankNote has not been sent",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
}

export default giftController;
