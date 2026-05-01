import eventSchemaValidator from "../Schemavalidator/host/host.event.validator.js";

class EventValidator {
 
  static validateCreateEvent(req, res, next) {
    const { isValid, errors, sanitizedData } = eventSchemaValidator(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "Event validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }

  static validateUpdateEvent(req, res, next) {
    const { isValid, errors, sanitizedData } = eventSchemaValidator(req.body);

    if (!isValid) {
      return res.status(400).json({
        message: "Event update validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }
}

export default EventValidator;