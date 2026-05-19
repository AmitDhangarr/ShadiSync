import validator from "validator";
import mongoose from "mongoose";

const { Types } = mongoose;

const allowedStatuses = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Booked",
  "Completed",
  "Cancelled",
];

const allowedPaymentStatuses = ["Unpaid", "Partial", "Paid", "Refunded"];

const allowedPriorities = ["Low", "Medium", "High", "Urgent"];

const allowedAttachmentTypes = [
  "Invoice",
  "Receipt",
  "Quotation",
  "Contract",
  "Other",
];

export const expenseSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    eventId,
    budgetId,
    expenseCode,
    title,
    description,
    category,
    subCategory,
    vendor,
    estimatedAmount,
    actualAmount,
    taxAmount,
    discountAmount,
    totalAmount,
    paidAmount,
    remainingAmount,
    status,
    paymentStatus,
    priority,
    expenseDate,
    bookingDate,
    dueDate,
    serviceDate,
    attachments,
    requestedBy,
    approvedBy,
    approvalDate,
    remarks,
    isDeleted,
    createdBy,
    updatedBy,
  } = data;

  if (!eventId || validator.isEmpty(eventId.toString().trim())) {
    errors.eventId = "Event ID is required";
  } else if (!Types.ObjectId.isValid(eventId)) {
    errors.eventId = "Invalid event ID";
  } else {
    sanitizedData.eventId = eventId;
  }

  if (!budgetId || validator.isEmpty(budgetId.toString().trim())) {
    errors.budgetId = "Budget ID is required";
  } else if (!Types.ObjectId.isValid(budgetId)) {
    errors.budgetId = "Invalid budget ID";
  } else {
    sanitizedData.budgetId = budgetId;
  }

  if (!title || validator.isEmpty(title.toString().trim())) {
    errors.title = "Title is required";
  } else {
    sanitizedData.title = validator.escape(title.toString().trim());
  }

  if (expenseCode !== undefined) {
    sanitizedData.expenseCode = validator.escape(expenseCode.toString().trim());
  }

  if (description !== undefined) {
    sanitizedData.description = validator.escape(description.toString().trim());
  }

  if (category !== undefined) {
    sanitizedData.category = validator.escape(category.toString().trim());
  }

  if (subCategory !== undefined) {
    sanitizedData.subCategory = validator.escape(subCategory.toString().trim());
  }

  if (vendor !== undefined && typeof vendor === "object") {
    sanitizedData.vendor = {};

    if (vendor.vendorId) {
      if (!Types.ObjectId.isValid(vendor.vendorId)) {
        errors.vendorId = "Invalid vendor ID";
      } else {
        sanitizedData.vendor.vendorId = vendor.vendorId;
      }
    }

    if (vendor.name) {
      sanitizedData.vendor.name = validator.escape(vendor.name.toString().trim());
    }

    if (vendor.contactPerson) {
      sanitizedData.vendor.contactPerson = validator.escape(
        vendor.contactPerson.toString().trim()
      );
    }

    if (vendor.phone) {
      sanitizedData.vendor.phone = vendor.phone.toString().trim();
    }

    if (vendor.email) {
      if (!validator.isEmail(vendor.email.toString().trim())) {
        errors.vendorEmail = "Invalid vendor email";
      } else {
        sanitizedData.vendor.email = vendor.email.toString().trim();
      }
    }

    if (vendor.gstNumber) {
      sanitizedData.vendor.gstNumber = validator.escape(
        vendor.gstNumber.toString().trim()
      );
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
    const value = data[field];
    if (value !== undefined) {
      if (!validator.isNumeric(value.toString())) {
        errors[field] = `${field} must be numeric`;
      } else {
        sanitizedData[field] = Number(value);
      }
    }
  });

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      errors.status = "Invalid expense status";
    } else {
      sanitizedData.status = status;
    }
  }

  if (paymentStatus !== undefined) {
    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      errors.paymentStatus = "Invalid payment status";
    } else {
      sanitizedData.paymentStatus = paymentStatus;
    }
  }

  if (priority !== undefined) {
    if (!allowedPriorities.includes(priority)) {
      errors.priority = "Invalid priority";
    } else {
      sanitizedData.priority = priority;
    }
  }

  const dateFields = [
    "expenseDate",
    "bookingDate",
    "dueDate",
    "serviceDate",
    "approvalDate",
  ];

  dateFields.forEach((field) => {
    const value = data[field];
    if (value !== undefined) {
      if (!validator.isISO8601(value.toString())) {
        errors[field] = `Invalid ${field}`;
      } else {
        sanitizedData[field] = new Date(value);
      }
    }
  });

  if (attachments !== undefined && Array.isArray(attachments)) {
    sanitizedData.attachments = attachments.map((a, i) => {
      if (a.type && !allowedAttachmentTypes.includes(a.type)) {
        errors[`attachments[${i}].type`] = "Invalid attachment type";
      }
      return {
        type: a.type ? a.type.toString().trim() : undefined,
        fileUrl: a.fileUrl ? a.fileUrl.toString().trim() : undefined,
        fileName: a.fileName ? validator.escape(a.fileName.toString().trim()) : undefined,
      };
    });
  }

  const objectIdFields = ["requestedBy", "approvedBy", "createdBy", "updatedBy"];
  objectIdFields.forEach((field) => {
    const value = data[field];
    if (value !== undefined) {
      if (!Types.ObjectId.isValid(value)) {
        errors[field] = `Invalid ${field} ID`;
      } else {
        sanitizedData[field] = value;
      }
    }
  });

  if (remarks !== undefined) {
    sanitizedData.remarks = validator.escape(remarks.toString().trim());
  }

  if (isDeleted !== undefined) {
    sanitizedData.isDeleted = !!isDeleted;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default expenseSchemaValidator;