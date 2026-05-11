import giftRegistrySchemaValidator from "../Schemavalidator/host/host.gift.validator.js";

class GiftValidator {
  static HandleGiftCreation(req, res, next) {
    const { isValid, errors, sanitizedData } =
      giftRegistrySchemaValidator(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Gift registry validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }
}

export default GiftValidator;