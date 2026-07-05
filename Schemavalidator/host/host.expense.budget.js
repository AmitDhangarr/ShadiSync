import validator from "validator";

const allowedStatuses = ["Draft", "Approved", "Closed"];

const allowedBudgetTypes = [
  "Operational",
  "Vendor",
  "Marketing",
  "Emergency",
  "Miscellaneous",
];

const isNonNegativeNumber = (val) =>
  validator.isNumeric(val.toString(), { no_symbols: false }) && Number(val) >= 0;

const isMissing = (val) =>
  val === undefined || val === null || val.toString().trim() === "";

export const budgetSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};
 
  const {
    category,
    subCategory,
    allocatedAmount,
    revisedAmount,
    consumedAmount,
    status,
    notes,
    approvedBy,
    budgetCode,
    title,
    budgetType,
    functionId,
    startDate,
    endDate,
    isLocked,
  } = data || {};

  if (isMissing(category)) {
    errors.category = "Category is required";
  } else if (!validator.isLength(category.toString().trim(), { min: 1, max: 100 })) {
    errors.category = "Category must be between 1 and 100 characters";
  } else {
    sanitizedData.category = validator.escape(category.toString().trim());
  }

  if (isMissing(title)) {
    errors.title = "Title is required";
  } else if (!validator.isLength(title.toString().trim(), { min: 1, max: 150 })) {
    errors.title = "Title must be between 1 and 150 characters";
  } else {
    sanitizedData.title = validator.escape(title.toString().trim());
  }

  if (isMissing(subCategory)) {
    errors.subCategory = "Sub-category is required";
  } else if (!validator.isLength(subCategory.toString().trim(), { max: 100 })) {
    errors.subCategory = "Sub-category must be 100 characters or fewer";
  } else {
    sanitizedData.subCategory = validator.escape(subCategory.toString().trim());
  }

  if (isMissing(notes)) {
    errors.notes = "Notes is required";
  } else if (!validator.isLength(notes.toString().trim(), { max: 1000 })) {
    errors.notes = "Notes must be 1000 characters or fewer";
  } else {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (isMissing(budgetCode)) {
    errors.budgetCode = "Budget code is required";
  } else if (!validator.matches(budgetCode.toString().trim(), /^[A-Za-z0-9_-]{3,30}$/)) {
    errors.budgetCode =
      "Budget code must be 3-30 characters, using only letters, numbers, hyphens, or underscores";
  } else {
    sanitizedData.budgetCode = validator.escape(budgetCode.toString().trim());
  }

  if (isMissing(status)) {
    errors.status = "Status is required";
  } else if (!allowedStatuses.includes(status)) {
    errors.status = `Invalid budget status. Allowed: ${allowedStatuses.join(", ")}`;
  } else {
    sanitizedData.status = status;
  }

  if (isMissing(budgetType)) {
    errors.budgetType = "Budget type is required";
  } else if (!allowedBudgetTypes.includes(budgetType)) {
    errors.budgetType = `Invalid budget type. Allowed: ${allowedBudgetTypes.join(", ")}`;
  } else {
    sanitizedData.budgetType = budgetType;
  }

  if (isMissing(allocatedAmount)) {
    errors.allocatedAmount = "Allocated amount is required";
  } else if (!isNonNegativeNumber(allocatedAmount)) {
    errors.allocatedAmount = "Allocated amount must be a non-negative number";
  } else {
    sanitizedData.allocatedAmount = Number(allocatedAmount);
  }

  if (isMissing(revisedAmount)) {
    errors.revisedAmount = "Revised amount is required";
  } else if (!isNonNegativeNumber(revisedAmount)) {
    errors.revisedAmount = "Revised amount must be a non-negative number";
  } else {
    sanitizedData.revisedAmount = Number(revisedAmount);
  }

  if (isMissing(consumedAmount)) {
    errors.consumedAmount = "Consumed amount is required";
  } else if (!isNonNegativeNumber(consumedAmount)) {
    errors.consumedAmount = "Consumed amount must be a non-negative number";
  } else {
    sanitizedData.consumedAmount = Number(consumedAmount);
  }

  if (sanitizedData.consumedAmount !== undefined) {
    const ceiling =
      sanitizedData.revisedAmount !== undefined
        ? sanitizedData.revisedAmount
        : sanitizedData.allocatedAmount;

    if (ceiling !== undefined && sanitizedData.consumedAmount > ceiling) {
      errors.consumedAmount = "Consumed amount cannot exceed the allocated/revised amount";
    }
  }

  if (isMissing(approvedBy)) {
    errors.approvedBy = "ApprovedBy is required";
  } else if (typeof approvedBy !== "string" || !validator.isLength(approvedBy.trim(), { min: 1, max: 100 })) {
    errors.approvedBy = "ApprovedBy must be a string between 1 and 100 characters";
  } else {
    sanitizedData.approvedBy = validator.escape(approvedBy.trim());
  }

  if (isMissing(functionId)) {
    errors.functionId = "FunctionId is required";
  } else if (typeof functionId !== "string" || !validator.isLength(functionId.trim(), { min: 1, max: 100 })) {
    errors.functionId = "FunctionId must be a string between 1 and 100 characters";
  } else {
    sanitizedData.functionId = validator.escape(functionId.trim());
  }

  if (isMissing(startDate)) {
    errors.startDate = "Start date is required";
  } else if (!validator.isISO8601(startDate.toString())) {
    errors.startDate = "Invalid start date";
  } else {
    sanitizedData.startDate = new Date(startDate);
  }

  if (isMissing(endDate)) {
    errors.endDate = "End date is required";
  } else if (!validator.isISO8601(endDate.toString())) {
    errors.endDate = "Invalid end date";
  } else {
    sanitizedData.endDate = new Date(endDate);
  }

  if (sanitizedData.startDate && sanitizedData.endDate) {
    if (sanitizedData.startDate > sanitizedData.endDate) {
      errors.dateRange = "Start date cannot be greater than end date";
    }
  }

  if (isLocked === undefined || isLocked === null || isLocked === "") {
    errors.isLocked = "isLocked is required";
  } else if (typeof isLocked === "boolean") {
    sanitizedData.isLocked = isLocked;
  } else if (isLocked === "true" || isLocked === "false") {
    sanitizedData.isLocked = isLocked === "true";
  } else {
    errors.isLocked = "isLocked must be a boolean value";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};