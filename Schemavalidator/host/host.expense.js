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

export const expenseSchemaValidator = ({data:unsantizedData}) => {
  const errors = {};
  const sanitizedData = {};

  const data  = unsantizedData || {};

  if (data.eventId) {
    if (!Types.ObjectId.isValid(data.eventId)) {
      errors.eventId = "Invalid Event ID";
    } else {
      sanitizedData.eventId = data.eventId;
    }
  }

  if (data.budgetId) {
    if (!Types.ObjectId.isValid(data.budgetId)) {
      errors.budgetId = "Invalid Budget ID";
    } else {
      sanitizedData.budgetId = data.budgetId;
    }
  }

  if (!data.expenseCode || validator.isEmpty(data.expenseCode.toString().trim())) {
    errors.expenseCode = "Expense code is required";
  } else {
    sanitizedData.expenseCode = validator.escape(data.expenseCode.toString().trim());
  }

  if (!data.title || validator.isEmpty(data.title.toString().trim())) {
    errors.title = "Title is required";
  } else {
    sanitizedData.title = validator.escape(data.title.toString().trim());
  }

  if (!data.description || validator.isEmpty(data.description.toString().trim())) {
    errors.description = "Description is required";
  } else {
    sanitizedData.description = validator.escape(data.description.toString().trim());
  }

  if (!data.category || validator.isEmpty(data.category.toString().trim())) {
    errors.category = "Category is required";
  } else {
    sanitizedData.category = validator.escape(data.category.toString().trim());
  }

  if (!data.subCategory || validator.isEmpty(data.subCategory.toString().trim())) {
    errors.subCategory = "SubCategory is required";
  } else {
    sanitizedData.subCategory = validator.escape(data.subCategory.toString().trim());
  }

  if (!data.vendor || typeof data.vendor !== "object") {
    errors.vendor = "Vendor is required";
  } else {
    sanitizedData.vendor = {};

    if (!data.vendor.vendorId) {
      errors.vendorId = "Vendor ID is required";
    } else if (!Types.ObjectId.isValid(data.vendor.vendorId)) {
      errors.vendorId = "Invalid Vendor ID";
    } else {
      sanitizedData.vendor.vendorId = data.vendor.vendorId;
    }

    if (!data.vendor.name || validator.isEmpty(data.vendor.name.toString().trim())) {
      errors.vendorName = "Vendor name is required";
    } else {
      sanitizedData.vendor.name = validator.escape(data.vendor.name.toString().trim());
    }

    if (!data.vendor.contactPerson || validator.isEmpty(data.vendor.contactPerson.toString().trim())) {
      errors.contactPerson = "Contact person is required";
    } else {
      sanitizedData.vendor.contactPerson = validator.escape(
        data.vendor.contactPerson.toString().trim()
      );
    }

    if (!data.vendor.phone || validator.isEmpty(data.vendor.phone.toString().trim())) {
      errors.vendorPhone = "Vendor phone is required";
    } else {
      sanitizedData.vendor.phone = data.vendor.phone.toString().trim();
    }

    if (!data.vendor.email || validator.isEmpty(data.vendor.email.toString().trim())) {
      errors.vendorEmail = "Vendor email is required";
    } else if (!validator.isEmail(data.vendor.email.toString().trim())) {
      errors.vendorEmail = "Invalid vendor email";
    } else {
      sanitizedData.vendor.email = data.vendor.email.toString().trim();
    }

    if (!data.vendor.gstNumber || validator.isEmpty(data.vendor.gstNumber.toString().trim())) {
      errors.vendorGstNumber = "Vendor GST number is required";
    } else {
      sanitizedData.vendor.gstNumber = validator.escape(
        data.vendor.gstNumber.toString().trim()
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

    if (value === undefined || value === null || value === "") {
      errors[field] = `${field} is required`;
    } else if (!validator.isNumeric(value.toString())) {
      errors[field] = `${field} must be numeric`;
    } else {
      sanitizedData[field] = Number(value);
    }
  });

  if (!data.status) {
    errors.status = "Status is required";
  } else if (!allowedStatuses.includes(data.status)) {
    errors.status = "Invalid status";
  } else {
    sanitizedData.status = data.status;
  }

  if (!data.paymentStatus) {
    errors.paymentStatus = "Payment status is required";
  } else if (!allowedPaymentStatuses.includes(data.paymentStatus)) {
    errors.paymentStatus = "Invalid payment status";
  } else {
    sanitizedData.paymentStatus = data.paymentStatus;
  }

  if (!data.priority) {
    errors.priority = "Priority is required";
  } else if (!allowedPriorities.includes(data.priority)) {
    errors.priority = "Invalid priority";
  } else {
    sanitizedData.priority = data.priority;
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

    if (!value) {
      errors[field] = `${field} is required`;
    } else if (!validator.isISO8601(value.toString())) {
      errors[field] = `Invalid ${field}`;
    } else {
      sanitizedData[field] = new Date(value);
    }
  });

  if (!data.attachments || !Array.isArray(data.attachments)) {
    errors.attachments = "Attachments are required";
  } else {
    sanitizedData.attachments = data.attachments.map((a, i) => {
      if (!a.type) {
        errors[`attachments[${i}].type`] = "Attachment type is required";
      } else if (!allowedAttachmentTypes.includes(a.type)) {
        errors[`attachments[${i}].type`] = "Invalid attachment type";
      }

      if (!a.fileUrl) {
        errors[`attachments[${i}].fileUrl`] = "File URL is required";
      }

      if (!a.fileName) {
        errors[`attachments[${i}].fileName`] = "File name is required";
      }

      return {
        type: a.type,
        fileUrl: a.fileUrl,
        fileName: validator.escape(a.fileName.toString().trim()),
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
    const value = data[field];

    if (!value) {
      errors[field] = `${field} is required`;
    } else if (!Types.ObjectId.isValid(value)) {
      errors[field] = `Invalid ${field}`;
    } else {
      sanitizedData[field] = value;
    }
  });

  if (!data.remarks || validator.isEmpty(data.remarks.toString().trim())) {
    errors.remarks = "Remarks is required";
  } else {
    sanitizedData.remarks = validator.escape(data.remarks.toString().trim());
  }

  if (data.isDeleted === undefined) {
    errors.isDeleted = "isDeleted is required";
  } else {
    sanitizedData.isDeleted = Boolean(data.isDeleted);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default expenseSchemaValidator;