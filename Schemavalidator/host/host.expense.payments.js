import validator from "validator";

const allowedPaymentTypes = ["Advance", "Partial", "Final", "Refund"];
const allowedPaymentMethods = ["Cash", "UPI", "Bank Transfer", "Card", "Cheque"];
const allowedStatuses = ["Pending", "Completed", "Failed", "Cancelled"];

export const paymentSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    paymentCode,
    amount,
    paymentType,
    paymentMethod,
    paymentDate,
    status,
    transactionReference,
    notes,
    attachments,
  } = data;

  if (!paymentCode || validator.isEmpty(paymentCode.toString().trim())) {
    errors.paymentCode = "Payment code is required";
  } else {
    sanitizedData.paymentCode = validator.escape(paymentCode.toString().trim());
  }

  const numAmount = Number(amount);
  if (amount === undefined || amount === null || amount === "") {
    errors.amount = "Amount is required";
  } else if (Number.isNaN(numAmount)) {
    errors.amount = "Amount must be numeric";
  } else {
    sanitizedData.amount = numAmount;
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

  if (status !== undefined && status !== null && status !== "") {
    if (!allowedStatuses.includes(status)) {
      errors.status = "Invalid payment status";
    } else {
      sanitizedData.status = status;
    }
  }

  if (transactionReference !== undefined && transactionReference !== null) {
    sanitizedData.transactionReference = validator.escape(
      transactionReference.toString().trim()
    );
  }

  if (notes !== undefined && notes !== null) {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (Array.isArray(attachments)) {
    sanitizedData.attachments = attachments
      .map((a) => ({
        fileName: a.fileName
          ? validator.escape(a.fileName.toString().trim())
          : null,
        fileUrl: a.fileUrl ? a.fileUrl.toString().trim() : null,
      }))
      .filter((a) => a.fileName && a.fileUrl);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};