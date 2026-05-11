class giftController {
  static getAllRegistry(req, res) {
    return res.status(200).json({
      success: true,
      message: "All registry records fetched (test)",
    });
  }

  static getGuestList(req, res) {
    return res.status(200).json({
      success: true,
      message: "Guest list fetched (test)",
    });
  }

  static getCashReceived(req, res) {
    return res.status(200).json({
      success: true,
      message: "Cash received data fetched (test)",
    });
  }

  static getGiftRegistry(req, res) {
    return res.status(200).json({
      success: true,
      message: "Gift registry fetched (test)",
    });
  }

  static getItemList(req, res) {
    return res.status(200).json({
      success: true,
      message: "Item list fetched (test)",
    });
  }

  static getPaymentDetails(req, res) {
    return res.status(200).json({
      success: true,
      message: "Payment details fetched (test)",
    });
  }

  static getGiftRegistryByEvent(req, res) {
    return res.status(200).json({
      success: true,
      message: "Gift registry by event fetched (test)",
      eventId: req.params.eventId,
    });
  }

  static getGiftRegistryByGuest(req, res) {
    return res.status(200).json({
      success: true,
      message: "Gift registry by guest fetched (test)",
      guestName: req.params.guestName,
    });
  }
  static sendThankYou(req, res) {
    return res.status(200).json({
      success: true,
      message: "Thank you marked as sent (test)",
      giftId: req.params.id,
      thank_you_sent: true,
    });
  }
}

export default giftController;
