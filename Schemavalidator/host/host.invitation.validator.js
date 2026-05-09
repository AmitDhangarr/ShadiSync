import validator from "validator";

const InvitationSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    firstName,
    lastName,
    address,
    contactNumber,
    event,
    date,
    time,
    category,
    chiefGuest,
    status,
    acceptance,
  } = data;

  if (!firstName || validator.isEmpty(firstName.toString().trim())) {
    errors.firstName = "First name is required";
  } else {
    sanitizedData.firstName = validator.escape(firstName.toString().trim());
  }

  if (!lastName || validator.isEmpty(lastName.toString().trim())) {
    errors.lastName = "Last name is required";
  } else {
    sanitizedData.lastName = validator.escape(lastName.toString().trim());
  }

  if (!address || validator.isEmpty(address.toString().trim())) {
    errors.address = "Address is required";
  } else {
    sanitizedData.address = validator.escape(address.toString().trim());
  }

  if (!contactNumber || validator.isEmpty(contactNumber.toString().trim())) {
    errors.contactNumber = "Contact number is required";
  } else if (!validator.isNumeric(contactNumber.toString())) {
    errors.contactNumber = "Contact number must be numeric";
  } else {
    sanitizedData.contactNumber = contactNumber.toString().trim();
  }

  if (!event || validator.isEmpty(event.toString().trim())) {
    errors.event = "Event is required";
  } else {
    sanitizedData.event = validator.escape(event.toString().trim());
  }

  if (!date) {
    errors.date = "Date is required";
  } else if (!validator.isISO8601(date.toString())) {
    errors.date = "Invalid date format";
  } else {
    sanitizedData.date = new Date(date);
  }

  if (!time || validator.isEmpty(time.toString().trim())) {
    errors.time = "Time is required";
  } else {
    sanitizedData.time = validator.escape(time.toString().trim());
  }

  const categoryEnum = ["local", "relative", "friend", "friend of friend"];

  if (!category || validator.isEmpty(category.toString().trim())) {
    errors.category = "Category is required";
  } else if (!categoryEnum.includes(category.toString().trim())) {
    errors.category = "Invalid category";
  } else {
    sanitizedData.category = validator.escape(category.toString().trim());
  }

  if (chiefGuest && !validator.isEmpty(chiefGuest.toString().trim())) {
    sanitizedData.chiefGuest = validator.escape(chiefGuest.toString().trim());
  }

  const statusEnum = ["invited", "not invited"];

  if (status && !validator.isEmpty(status.toString().trim())) {
    if (!statusEnum.includes(status.toString().trim())) {
      errors.status = "Invalid status (allowed: invited, not invited)";
    } else {
      sanitizedData.status = validator.escape(status.toString().trim());
    }
  }

  const acceptanceEnum = ["accepted", "rejected", "pending"];

  if (acceptance && !validator.isEmpty(acceptance.toString().trim())) {
    if (!acceptanceEnum.includes(acceptance.toString().trim())) {
      errors.acceptance = "Invalid acceptance value";
    } else {
      sanitizedData.acceptance = validator.escape(acceptance.toString().trim());
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default InvitationSchemaValidator;
