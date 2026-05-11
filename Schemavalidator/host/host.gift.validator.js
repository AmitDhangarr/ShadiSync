import validator from "validator";

const giftRegistrySchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    event_id,
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
  } = data;

  if (!event_id || validator.isEmpty(event_id.toString().trim())) {
    errors.event_id = "Event ID is required";
  } else if (!validator.isMongoId(event_id.toString())) {
    errors.event_id = "Invalid Event ID";
  } else {
    sanitizedData.event_id = event_id.toString().trim();
  }

  if (!guest_name || validator.isEmpty(guest_name.toString().trim())) {
    errors.guest_name = "Guest name is required";
  } else {
    sanitizedData.guest_name = validator.escape(guest_name.toString().trim());
  }

  const allowedGiftTypes = ["Cash", "Gift Item", "Gold", "Voucher"];

  if (!gift_type || validator.isEmpty(gift_type.toString().trim())) {
    errors.gift_type = "Gift type is required";
  } else if (!allowedGiftTypes.includes(gift_type)) {
    errors.gift_type = "Invalid gift type";
  } else {
    sanitizedData.gift_type = gift_type;
  }

  if (guest_family && !validator.isEmpty(guest_family.toString().trim())) {
    sanitizedData.guest_family = validator.escape(
      guest_family.toString().trim(),
    );
  }

  if (mobile_number && !validator.isEmpty(mobile_number.toString().trim())) {
    const mobile = mobile_number.toString().trim();
    if (!validator.isNumeric(mobile)) {
      errors.mobile_number = "Mobile number must be numeric";
    } else {
      sanitizedData.mobile_number = mobile;
    }
  }

  if (
    shagun_amount !== undefined &&
    shagun_amount !== null &&
    shagun_amount !== ""
  ) {
    if (!validator.isNumeric(shagun_amount.toString())) {
      errors.shagun_amount = "Shagun amount must be numeric";
    } else {
      sanitizedData.shagun_amount = Number(shagun_amount);
    }
  }

  if (gift_item_name) {
    sanitizedData.gift_item_name = validator.escape(
      gift_item_name.toString().trim(),
    );
  }

  if (gift_description) {
    sanitizedData.gift_description = validator.escape(
      gift_description.toString().trim(),
    );
  }

  const allowedFunctions = [
    "Engagement",
    "Haldi",
    "Mehndi",
    "Sangeet",
    "Wedding",
    "Reception",
    "Other",
  ];

  if (function_name) {
    if (!allowedFunctions.includes(function_name)) {
      errors.function_name = "Invalid function name";
    } else {
      sanitizedData.function_name = function_name;
    }
  }

  const allowedPaymentModes = [
    "Cash",
    "UPI",
    "Cheque",
    "Bank Transfer",
    "Other",
  ];

  if (payment_mode) {
    if (!allowedPaymentModes.includes(payment_mode)) {
      errors.payment_mode = "Invalid payment mode";
    } else {
      sanitizedData.payment_mode = payment_mode;
    }
  }

  if (transaction_reference) {
    sanitizedData.transaction_reference = validator.escape(
      transaction_reference.toString().trim(),
    );
  }

  if (envelope_number) {
    sanitizedData.envelope_number = validator.escape(
      envelope_number.toString().trim(),
    );
  }

  if (received_by) {
    sanitizedData.received_by = validator.escape(received_by.toString().trim());
  }

  if (received_at) {
    if (!validator.isISO8601(received_at.toString())) {
      errors.received_at = "Invalid date format";
    } else {
      sanitizedData.received_at = new Date(received_at);
    }
  }

  if (photo) {
    sanitizedData.photo = photo.toString().trim();
  }

  if (notes) {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (typeof thank_you_sent === "boolean") {
    sanitizedData.thank_you_sent = thank_you_sent;
  }

  if (typeof return_gift_given === "boolean") {
    sanitizedData.return_gift_given = return_gift_given;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default giftRegistrySchemaValidator;
