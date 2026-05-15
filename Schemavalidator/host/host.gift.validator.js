import validator from "validator";

const giftRegistrySchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

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
  } = data;

  if (!guest_name || validator.isEmpty(guest_name.toString().trim())) {
    errors.guest_name = "Guest name is required";
  } else {
    sanitizedData.guest_name = validator.escape(guest_name.toString().trim());
  }

  if (!guest_family || validator.isEmpty(guest_family.toString().trim())) {
    errors.guest_family = "Guest family is required";
  } else {
    sanitizedData.guest_family = validator.escape(
      guest_family.toString().trim()
    );
  }

  if (!mobile_number || validator.isEmpty(mobile_number.toString().trim())) {
    errors.mobile_number = "Mobile number is required";
  } else {
    const mobile = mobile_number.toString().trim();

    if (!validator.isNumeric(mobile)) {
      errors.mobile_number = "Mobile number must be numeric";
    } else {
      sanitizedData.mobile_number = mobile;
    }
  }

  const allowedGiftTypes = ["Cash", "Gift Item", "Gold", "Voucher"];

  if (!gift_type || validator.isEmpty(gift_type.toString().trim())) {
    errors.gift_type = "Gift type is required";
  } else if (!allowedGiftTypes.includes(gift_type)) {
    errors.gift_type = "Invalid gift type";
  } else {
    sanitizedData.gift_type = gift_type;
  }

  if (
    shagun_amount === undefined ||
    shagun_amount === null ||
    shagun_amount === ""
  ) {
    errors.shagun_amount = "Shagun amount is required";
  } else if (!validator.isNumeric(shagun_amount.toString())) {
    errors.shagun_amount = "Shagun amount must be numeric";
  } else {
    sanitizedData.shagun_amount = Number(shagun_amount);
  }

  if (!gift_item_name || validator.isEmpty(gift_item_name.toString().trim())) {
    errors.gift_item_name = "Gift item name is required";
  } else {
    sanitizedData.gift_item_name = validator.escape(
      gift_item_name.toString().trim()
    );
  }

  if (!gift_description || validator.isEmpty(gift_description.toString().trim())) {
    errors.gift_description = "Gift description is required";
  } else {
    sanitizedData.gift_description = validator.escape(
      gift_description.toString().trim()
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

  if (!function_name || validator.isEmpty(function_name.toString().trim())) {
    errors.function_name = "Function name is required";
  } else if (!allowedFunctions.includes(function_name)) {
    errors.function_name = "Invalid function name";
  } else {
    sanitizedData.function_name = function_name;
  }

  const allowedPaymentModes = [
    "Cash",
    "UPI",
    "Cheque",
    "Bank Transfer",
    "Other",
  ];

  if (!payment_mode || validator.isEmpty(payment_mode.toString().trim())) {
    errors.payment_mode = "Payment mode is required";
  } else if (!allowedPaymentModes.includes(payment_mode)) {
    errors.payment_mode = "Invalid payment mode";
  } else {
    sanitizedData.payment_mode = payment_mode;
  }

  if (
    !transaction_reference ||
    validator.isEmpty(transaction_reference.toString().trim())
  ) {
    errors.transaction_reference = "Transaction reference is required";
  } else {
    sanitizedData.transaction_reference = validator.escape(
      transaction_reference.toString().trim()
    );
  }

  if (!envelope_number || validator.isEmpty(envelope_number.toString().trim())) {
    errors.envelope_number = "Envelope number is required";
  } else {
    sanitizedData.envelope_number = validator.escape(
      envelope_number.toString().trim()
    );
  }

  if (!received_by || validator.isEmpty(received_by.toString().trim())) {
    errors.received_by = "Received by is required";
  } else {
    sanitizedData.received_by = validator.escape(received_by.toString().trim());
  }

  if (!received_at || validator.isEmpty(received_at.toString().trim())) {
    errors.received_at = "Received at date is required";
  } else if (!validator.isISO8601(received_at.toString())) {
    errors.received_at = "Invalid date format";
  } else {
    sanitizedData.received_at = new Date(received_at);
  }

  if (!photo || validator.isEmpty(photo.toString().trim())) {
    errors.photo = "Photo is required";
  } else {
    sanitizedData.photo = photo.toString().trim();
  }

  if (!notes || validator.isEmpty(notes.toString().trim())) {
    errors.notes = "Notes are required";
  } else {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (typeof thank_you_sent !== "boolean") {
    errors.thank_you_sent = "Thank you sent status is required";
  } else {
    sanitizedData.thank_you_sent = thank_you_sent;
  }

  if (typeof return_gift_given !== "boolean") {
    errors.return_gift_given = "Return gift given status is required";
  } else {
    sanitizedData.return_gift_given = return_gift_given;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default giftRegistrySchemaValidator;