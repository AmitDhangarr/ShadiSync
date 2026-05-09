import InvitationSchemaValidator from "../Schemavalidator/host/host.invitation.validator.js";
class InvitationValidator {
  static ValidateCreateInvitation(req, res, next) {
    const { isValid, errors, sanitizedData } = InvitationSchemaValidator(
      req.body,
    );
    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: errors,
        message: "create invitation validation failed",
      });
    }
    req.body = sanitizedData;
    next();
  }
  static ValidateUpdateInvitation(req, res, next) {
    const { isValid, errors, sanitizedData } = InvitationSchemaValidator(
      req.body,
    );
    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: errors,
        message: "update invitation validation failed",
      });
    }

    next();
  }
}

export default InvitationValidator;
