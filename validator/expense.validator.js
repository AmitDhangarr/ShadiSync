import { budgetSchemaValidator } from "../Schemavalidator/host/host.expense.budget.js";
import { expenseSchemaValidator } from "../Schemavalidator/host/host.expense.js";
import { paymentSchemaValidator } from "../Schemavalidator/host/host.expense.payments.js";

class ExpenseValidator {
  static HandleBugetValidation(req, res, next) {
    const { isValid, errors, sanitizedData } = budgetSchemaValidator(req.body);
    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "budget validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }

  static HandleExpenseValidation(req, res, next) {
    const { isValid, errors, sanitizedData } = expenseSchemaValidator(req.body);
    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "expense validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }

  static HandlePaymentsValidation(req, res, next) {
    const { isValid, errors, sanitizedData } = paymentSchemaValidator(req.body);
    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "payment validation failed",
        errors,
      });
    }

    req.body = sanitizedData;
    next();
  }
}

export default ExpenseValidator;
