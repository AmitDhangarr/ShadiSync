import validator from "validator";
import mongoose from "mongoose";

const { Types } = mongoose;

const allowedPaymentTypes = ["Advance", "Partial", "Final", "Refund"];

const allowedPaymentMethods = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Cheque",
];

const allowedStatuses = ["Pending", "Completed", "Failed", "Cancelled"];

export const paymentSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    eventId,
    expenseId,
    vendorId,
    paymentCode,
    amount,
    paymentType,
    paymentMethod,
    transactionReference,
    paymentDate,
    status,
    attachments,
    notes,
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

  if (!expenseId || validator.isEmpty(expenseId.toString().trim())) {
    errors.expenseId = "Expense ID is required";
  } else if (!Types.ObjectId.isValid(expenseId)) {
    errors.expenseId = "Invalid expense ID";
  } else {
    sanitizedData.expenseId = expenseId;
  }

  if (vendorId !== undefined) {
    if (!Types.ObjectId.isValid(vendorId)) {
      errors.vendorId = "Invalid vendor ID";
    } else {
      sanitizedData.vendorId = vendorId;
    }
  }

  if (!paymentCode || validator.isEmpty(paymentCode.toString().trim())) {
    errors.paymentCode = "Payment code is required";
  } else {
    sanitizedData.paymentCode = validator.escape(paymentCode.toString().trim());
  }

  if (amount === undefined || amount === null || amount === "") {
    errors.amount = "Amount is required";
  } else if (!validator.isNumeric(amount.toString())) {
    errors.amount = "Amount must be numeric";
  } else {
    sanitizedData.amount = Number(amount);
  }

  if (!paymentType || validator.isEmpty(paymentType.toString().trim())) {
    errors.paymentType = "Payment type is required";
  } else if (!allowedPaymentTypes.includes(paymentType)) {
    errors.paymentType = "Invalid payment type";
  } else {
    sanitizedData.paymentType = paymentType;
  }

  if (!paymentMethod || validator.isEmpty(paymentMethod.toString().trim())) {
    errors.paymentMethod = "Payment method is required";
  } else if (!allowedPaymentMethods.includes(paymentMethod)) {
    errors.paymentMethod = "Invalid payment method";
  } else {
    sanitizedData.paymentMethod = paymentMethod;
  }

  if (!paymentDate || validator.isEmpty(paymentDate.toString().trim())) {
    errors.paymentDate = "Payment date is required";
  } else if (!validator.isISO8601(paymentDate.toString())) {
    errors.paymentDate = "Invalid payment date";
  } else {
    sanitizedData.paymentDate = new Date(paymentDate);
  }

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      errors.status = "Invalid payment status";
    } else {
      sanitizedData.status = status;
    }
  }

  if (transactionReference !== undefined) {
    sanitizedData.transactionReference = validator.escape(
      transactionReference.toString().trim()
    );
  }

  if (notes !== undefined) {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (Array.isArray(attachments)) {
    sanitizedData.attachments = attachments.map((a, i) => ({
      fileName: a.fileName
        ? validator.escape(a.fileName.toString().trim())
        : undefined,
      fileUrl: a.fileUrl ? a.fileUrl.toString().trim() : undefined,
    }));
  }

  const objectIdFields = ["createdBy", "updatedBy"];

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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};