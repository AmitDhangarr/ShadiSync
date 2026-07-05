import validator from "validator";

const allowedStatuses = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Booked",
  "Completed",
  "Cancelled",
];

const allowedPaymentStatuses = [
  "Unpaid",
  "Partial",
  "Paid",
  "Refunded",
];

const allowedPriorities = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

const allowedAttachmentTypes = [
  "Invoice",
  "Receipt",
  "Quotation",
  "Contract",
  "Other",
];

const isValidObjectId = (value) =>
  typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

const toTrimmedString = (value) =>
  value === undefined || value === null ? "" : value.toString().trim();

const isBlank = (value) => {
  const str = toTrimmedString(value);
  return str === "" || validator.isEmpty(str);
};

export const expenseSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const unsantizedData = data || {};

  if (unsantizedData.eventId) {
    if (!isValidObjectId(unsantizedData.eventId)) {
      errors.eventId = "Invalid Event ID";
    } else {
      sanitizedData.eventId = unsantizedData.eventId;
    }
  }

  if (unsantizedData.budgetId) {
    if (!isValidObjectId(unsantizedData.budgetId)) {
      errors.budgetId = "Invalid Budget ID";
    } else {
      sanitizedData.budgetId = unsantizedData.budgetId;
    }
  }

  if (isBlank(unsantizedData.expenseCode)) {
    errors.expenseCode = "Expense code is required";
  } else {
    sanitizedData.expenseCode = validator.escape(toTrimmedString(unsantizedData.expenseCode));
  }

  if (isBlank(unsantizedData.title)) {
    errors.title = "Title is required";
  } else {
    sanitizedData.title = validator.escape(toTrimmedString(unsantizedData.title));
  }

  if (isBlank(unsantizedData.description)) {
    errors.description = "Description is required";
  } else {
    sanitizedData.description = validator.escape(toTrimmedString(unsantizedData.description));
  }

  if (isBlank(unsantizedData.category)) {
    errors.category = "Category is required";
  } else {
    sanitizedData.category = validator.escape(toTrimmedString(unsantizedData.category));
  }

  if (isBlank(unsantizedData.subCategory)) {
    errors.subCategory = "SubCategory is required";
  } else {
    sanitizedData.subCategory = validator.escape(toTrimmedString(unsantizedData.subCategory));
  }

  if (!unsantizedData.vendor || typeof unsantizedData.vendor !== "object") {
    errors.vendor = "Vendor is required";
  } else {
    const vendor = unsantizedData.vendor;
    sanitizedData.vendor = {};

    if (!vendor.vendorId) {
      errors.vendorId = "Vendor ID is required";
    } else if (!isValidObjectId(vendor.vendorId)) {
      errors.vendorId = "Invalid Vendor ID";
    } else {
      sanitizedData.vendor.vendorId = vendor.vendorId;
    }

    if (isBlank(vendor.name)) {
      errors.vendorName = "Vendor name is required";
    } else {
      sanitizedData.vendor.name = validator.escape(toTrimmedString(vendor.name));
    }

    if (isBlank(vendor.contactPerson)) {
      errors.contactPerson = "Contact person is required";
    } else {
      sanitizedData.vendor.contactPerson = validator.escape(toTrimmedString(vendor.contactPerson));
    }

    if (isBlank(vendor.phone)) {
      errors.vendorPhone = "Vendor phone is required";
    } else {
      sanitizedData.vendor.phone = toTrimmedString(vendor.phone);
    }

    if (isBlank(vendor.email)) {
      errors.vendorEmail = "Vendor email is required";
    } else if (!validator.isEmail(toTrimmedString(vendor.email))) {
      errors.vendorEmail = "Invalid vendor email";
    } else {
      sanitizedData.vendor.email = toTrimmedString(vendor.email);
    }

    if (isBlank(vendor.gstNumber)) {
      errors.vendorGstNumber = "Vendor GST number is required";
    } else {
      sanitizedData.vendor.gstNumber = validator.escape(toTrimmedString(vendor.gstNumber));
    }
  }

  const numericFields = [
    "estimatedAmount",
    "actualAmount",
    "taxAmount",
    "discountAmount",
    "totalAmount",
    "paidAmount",
    "remainingAmount",
  ];

  numericFields.forEach((field) => {
    const value = unsantizedData[field];

    if (value === undefined || value === null || value === "") {
      errors[field] = `${field} is required`;
    } else if (!validator.isNumeric(value.toString())) {
      errors[field] = `${field} must be numeric`;
    } else {
      sanitizedData[field] = Number(value);
    }
  });

  if (!unsantizedData.status) {
    errors.status = "Status is required";
  } else if (!allowedStatuses.includes(unsantizedData.status)) {
    errors.status = "Invalid status";
  } else {
    sanitizedData.status = unsantizedData.status;
  }

  if (!unsantizedData.paymentStatus) {
    errors.paymentStatus = "Payment status is required";
  } else if (!allowedPaymentStatuses.includes(unsantizedData.paymentStatus)) {
    errors.paymentStatus = "Invalid payment status";
  } else {
    sanitizedData.paymentStatus = unsantizedData.paymentStatus;
  }

  if (!unsantizedData.priority) {
    errors.priority = "Priority is required";
  } else if (!allowedPriorities.includes(unsantizedData.priority)) {
    errors.priority = "Invalid priority";
  } else {
    sanitizedData.priority = unsantizedData.priority;
  }

  const dateFields = [
    "expenseDate",
    "bookingDate",
    "dueDate",
    "serviceDate",
    "approvalDate",
  ];

  dateFields.forEach((field) => {
    const value = unsantizedData[field];

    if (!value) {
      errors[field] = `${field} is required`;
    } else if (!validator.isISO8601(value.toString())) {
      errors[field] = `Invalid ${field}`;
    } else {
      sanitizedData[field] = new Date(value);
    }
  });

  if (!unsantizedData.attachments || !Array.isArray(unsantizedData.attachments)) {
    errors.attachments = "Attachments are required";
  } else {
    sanitizedData.attachments = unsantizedData.attachments.map((a, i) => {
      const attachment = a || {};

      if (!attachment.type) {
        errors[`attachments[${i}].type`] = "Attachment type is required";
      } else if (!allowedAttachmentTypes.includes(attachment.type)) {
        errors[`attachments[${i}].type`] = "Invalid attachment type";
      }

      if (isBlank(attachment.fileUrl)) {
        errors[`attachments[${i}].fileUrl`] = "File URL is required";
      }

      if (isBlank(attachment.fileName)) {
        errors[`attachments[${i}].fileName`] = "File name is required";
      }

      return {
        type: allowedAttachmentTypes.includes(attachment.type) ? attachment.type : undefined,
        fileUrl: !isBlank(attachment.fileUrl)
          ? validator.escape(toTrimmedString(attachment.fileUrl))
          : undefined,
        fileName: !isBlank(attachment.fileName)
          ? validator.escape(toTrimmedString(attachment.fileName))
          : undefined,
      };
    });
  }

  const objectIdFields = [
    "requestedBy",
    "approvedBy",
    "createdBy",
    "updatedBy",
  ];

  objectIdFields.forEach((field) => {
    const value = unsantizedData[field];

    if (!value) {
      errors[field] = `${field} is required`;
    } else if (!isValidObjectId(value)) {
      errors[field] = `Invalid ${field}`;
    } else {
      sanitizedData[field] = value;
    }
  });

  if (isBlank(unsantizedData.remarks)) {
    errors.remarks = "Remarks is required";
  } else {
    sanitizedData.remarks = validator.escape(toTrimmedString(unsantizedData.remarks));
  }

  if (unsantizedData.isDeleted === undefined) {
    errors.isDeleted = "isDeleted is required";
  } else {
    sanitizedData.isDeleted = Boolean(unsantizedData.isDeleted);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default expenseSchemaValidator;