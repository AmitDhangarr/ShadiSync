import validator from "validator";
import mongoose from "mongoose";

const { Types } = mongoose;

const allowedStatuses = ["Draft", "Approved", "Closed"];

const allowedBudgetTypes = [
  "Operational",
  "Vendor",
  "Marketing",
  "Emergency",
  "Miscellaneous",
];

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
    createdBy,
    updatedBy,
    budgetCode,
    title,
    budgetType,
    functionId,
    startDate,
    endDate,
    isLocked,
  } = data || {};


  if (!category || validator.isEmpty(category.toString().trim())) {
    errors.category = "Category is required";
  } else {
    sanitizedData.category = validator.escape(category.toString().trim());
  }

  if (!title || validator.isEmpty(title.toString().trim())) {
    errors.title = "Title is required";
  } else {
    sanitizedData.title = validator.escape(title.toString().trim());
  }

  if (subCategory !== undefined) {
    sanitizedData.subCategory = validator.escape(subCategory.toString().trim());
  }

  if (notes !== undefined) {
    sanitizedData.notes = validator.escape(notes.toString().trim());
  }

  if (budgetCode !== undefined) {
    sanitizedData.budgetCode = validator.escape(budgetCode.toString().trim());
  }

  if (status !== undefined) {
    if (!allowedStatuses.includes(status)) {
      errors.status = "Invalid budget status";
    } else {
      sanitizedData.status = status;
    }
  }

  if (budgetType !== undefined) {
    if (!allowedBudgetTypes.includes(budgetType)) {
      errors.budgetType = "Invalid budget type";
    } else {
      sanitizedData.budgetType = budgetType;
    }
  }

  if (allocatedAmount === undefined || allocatedAmount === null || allocatedAmount === "") {
    errors.allocatedAmount = "Allocated amount is required";
  } else if (!validator.isNumeric(allocatedAmount.toString())) {
    errors.allocatedAmount = "Allocated amount must be numeric";
  } else {
    sanitizedData.allocatedAmount = Number(allocatedAmount);
  }

  if (revisedAmount !== undefined) {
    if (!validator.isNumeric(revisedAmount.toString())) {
      errors.revisedAmount = "Revised amount must be numeric";
    } else {
      sanitizedData.revisedAmount = Number(revisedAmount);
    }
  }

  if (consumedAmount !== undefined) {
    if (!validator.isNumeric(consumedAmount.toString())) {
      errors.consumedAmount = "Consumed amount must be numeric";
    } else {
      sanitizedData.consumedAmount = Number(consumedAmount);
    }
  }

  if (approvedBy !== undefined) {
    if (!Types.ObjectId.isValid(approvedBy)) {
      errors.approvedBy = "Invalid approvedBy ID";
    } else {
      sanitizedData.approvedBy = approvedBy;
    }
  }

  if (createdBy !== undefined) {
    if (!Types.ObjectId.isValid(createdBy)) {
      errors.createdBy = "Invalid createdBy ID";
    } else {
      sanitizedData.createdBy = createdBy;
    }
  }

  if (updatedBy !== undefined) {
    if (!Types.ObjectId.isValid(updatedBy)) {
      errors.updatedBy = "Invalid updatedBy ID";
    } else {
      sanitizedData.updatedBy = updatedBy;
    }
  }

  if (functionId !== undefined) {
    if (!Types.ObjectId.isValid(functionId)) {
      errors.functionId = "Invalid functionId ID";
    } else {
      sanitizedData.functionId = functionId;
    }
  }

  if (startDate !== undefined) {
    if (!validator.isISO8601(startDate.toString())) {
      errors.startDate = "Invalid start date";
    } else {
      sanitizedData.startDate = new Date(startDate);
    }
  }

  if (endDate !== undefined) {
    if (!validator.isISO8601(endDate.toString())) {
      errors.endDate = "Invalid end date";
    } else {
      sanitizedData.endDate = new Date(endDate);
    }
  }

  if (sanitizedData.startDate && sanitizedData.endDate) {
    if (sanitizedData.startDate > sanitizedData.endDate) {
      errors.dateRange = "Start date cannot be greater than end date";
    }
  }

  if (isLocked !== undefined) {
    sanitizedData.isLocked = isLocked === true || isLocked === "true";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};