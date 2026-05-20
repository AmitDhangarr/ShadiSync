import BUDGET from "./../../models/host/expense/buget.modal.js";
import EXPENSE from "../../models/host/expense/expense.modal.js";
import PAYMENTS from "../../models/host/expense/payments.modal.js";

class ExpenseController {
  static async handleCreateBudget(req, res) {
    try {
      const data = req.body;

      const budget = await BUDGET.create({
        eventId: req.params.event_id,
        ...data,
      });

      return res.status(201).json({
        success: true,
        data: budget,
        message: `Budget for event - ${req.params.event_id} has been created`,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetAllBudget(req, res) {
    try {
      const budgets = await BUDGET.find({});

      if (!budgets || budgets.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budget found",
        });
      }

      if (budgets) {
        return res.status(200).json({
          success: true,
          data: budgets,
          message: `Budgets have been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetBudget(req, res) {
    try {
      const budget = await BUDGET.findOne({ _id: req.params.id });

      if (!budget || budget.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budget found",
        });
      }

      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budget has been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleUpdateBudget(req, res) {
    try {
      const consumedAmount = req.body?.consumedAmount;
      const status = req.body?.status;

      const errors = {};

      const allowedStatuses = ["Draft", "Approved", "Closed"];

      if (status === undefined) {
        errors.status = "Status is required";
      } else if (!allowedStatuses.includes(status)) {
        errors.status = "Invalid status";
      }

      if (consumedAmount === undefined) {
        errors.consumedAmount = "Consumed amount is required";
      } else if (isNaN(consumedAmount)) {
        errors.consumedAmount = "Consumed amount must be numeric";
      } else if (Number(consumedAmount) < 0) {
        errors.consumedAmount = "Consumed amount cannot be negative";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          errors,
          message: "Validation failed",
        });
      }

      const budget = await BUDGET.findByIdAndUpdate(
        req.params.id,
        {
          ...(status !== undefined && { status }),
          ...(consumedAmount !== undefined && {
            consumedAmount: Number(consumedAmount),
          }),
        },
        { new: true },
      );

      if (!budget) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budget found",
        });
      }

      return res.status(200).json({
        success: true,
        data: budget,
        message: "Budget updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "Internal server error",
      });
    }
  }
  static async handleDeleteBudget(req, res) {
    try {
      const budget = await BUDGET.findByIdAndDelete({ _id: req.params.id });

      if (!budget || budget.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budget found",
        });
      }

      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budget has been deleted`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetBudget(req, res) {
    try {
      const budget = await BUDGET.findOne({ _id: req.params.id });

      if (!budget || budget.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budget found",
        });
      }

      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budget has been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleTotalBudgetAmount(req, res) {
    try {
      const TotalBudget = await BUDGET.aggregate([
        {
          $group: {
            _id: null,
            totalBudget: { $sum: "$revisedAmount" },
          },
        },
      ]);

      if (TotalBudget) {
        return res.status(200).json({
          success: true,
          data: TotalBudget,
          message: `Overall Total Budget Amount is ${TotalBudget}`,
        });

        if (!TotalBudget) {
          return res.status(404).json({
            success: false,
            error: "No total amount fetched",
            message: `No data found about the totalAmount`,
          });
        }
      }
    } catch (error) {
      return res.status(200).json({
        success: false,
        error: error,
        message: `internal server error`,
      });
    }
  }
  static async handleCategoryWiseBudget(req, res) {
    try {
      const category = req.params.category;
      const categoryWiseBudget = await BUDGET.findOne({ category: category });

      if (categoryWiseBudget) {
        return res.status(200).json({
          success: true,
          data: categoryWiseBudget,
          message: "categorywise budgets have been fetched",
        });
      }
      if (!categoryWiseBudget) {
        return res.status(404).json({
          success: true,
          data: categoryWiseBudget,
          message: "categorywise budgets have been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: true,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleBudgetByEvent(req, res) {
    try {
      const eventId = req.params.event_id;
      const budget = await BUDGET.findOne({ eventId: eventId });
      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: "budget based on the event has been fetched",
        });
      }
      if (!budget) {
        return res.status(404).json({
          success: false,
          error: "no budget by event has been found",
          message: "budget based on the event has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleApprovedBudgets(req, res) {
    try {
      const budgets = await BUDGET.find({ status: "Approved" }, {});

      if (!budgets || budgets.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budgets found",
        });
      }

      if (budgets) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budgets has been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleClosedBudget(req, res) {
    try {
      const budgets = await BUDGET.find({ status: "Closed" }, {});

      if (!budgets || budgets.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budgets found",
        });
      }

      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budgets has been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleDraftedBudget(req, res) {
    try {
      const budgets = await BUDGET.find({ status: "Drafted" });

      if (!budgets || budgets.length === 0) {
        return res.status(404).json({
          success: false,
          data: [],
          message: "No budgets found",
        });
      }

      if (budget) {
        return res.status(200).json({
          success: true,
          data: budget,
          message: `Budgets have been fetched`,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  // expense
  static async handleCreateExpense(req, res) {
    try {
      const data = req.body;
      const expense = await EXPENSE.create({
        eventId: req.params.event_id,
        BudgetId: req.params.budget_id,
        ...data,
      });

      if (expense) {
        return res.status(201).json({
          success: true,
          data: expense,
          message: "expense has been done",
        });
      }

      if (!expense) {
        return res.status(404).json({
          success: true,
          error: "error while creating expense",
          message: "expense has not been done",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpense(req, res) {
    try {
      const expense = await EXPENSE.findOne({ _id: req.params.id });

      if (expense) {
        return res.status(200).json({
          success: true,
          data: expense,
          message: "expense has been fetched",
        });
      }

      if (!expense) {
        return res.status(404).json({
          success: true,
          error: "error while fetching expense",
          message: "expense has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetAllExpense(req, res) {
    try {
      const expenses = await EXPENSE.find({});
      if (expenses) {
        return res.status(200).json({
          success: true,
          data: expenses,
          message: "expenses have been fetched",
        });
      }

      if (!expenses) {
        return res.status(404).json({
          success: true,
          error: "error while fetching expense",
          message: "expenses have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleUpdateExpense(req, res) {
    try {
      const { status, paymentStatus, priority, attachments } = req.body;

      const datatoupdate = {
        status,
        paymentStatus,
        priority,
        attachments,
      };

      const updateValidator = (data) => {
        const error = {};

        if (!data.status || data.status.trim() === "") {
          error.status = "provide the status";
        }

        if (!data.paymentStatus || data.paymentStatus.trim() === "") {
          error.paymentStatus = "provide the paymentStatus";
        }

        if (!data.priority || data.priority.trim() === "") {
          error.priority = "provide the priority";
        }

        if (!data.attachments || String(data.attachments).trim() === "") {
          error.attachments = "provide the attachments";
        }

        return Object.keys(error).length > 0 ? error : null;
      };

      const errors = updateValidator(datatoupdate);

      if (errors) {
        return res.status(400).json({
          success: false,
          error: errors,
          message: "update validation has failed",
        });
      }

      const expense = await EXPENSE.findByIdAndUpdate(
        req.params.id,
        datatoupdate,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "expense not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: expense,
        message: "expense has been updated",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "internal server error",
      });
    }
  }
  static async handleDeleteExpense(req, res) {
    try {
      const expense = await EXPENSE.findByIdAndDelete({ _id: req.params.id });

      return res.status(200).json({
        success: true,
        data: expense,
        message: "expense has been deleted",
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "expense not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpenseByVendor(req, res) {
    try {
      const vendor = await EXPENSE.find(
        { "vendor.vendorId": req.params.vendor_id },
        {},
      );

      if (vendor) {
        return res.status(200).json({
          success: true,
          data: vendor,
          message: "expense related to vendor has been fetched",
        });
      }

      if (!vendor) {
        return res.status(400).json({
          success: true,
          error: "error while fetching vendor",
          message: "expense related to vendor has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpenseByEvent(req, res) {
    try {
      const expenses = await EXPENSE.find({ eventId: req.params.event_id }, {});

      if (expenses) {
        return res.status(200).json({
          success: true,
          data: expenses,
          message: "expenses related to event have been fetched",
        });
      }

      if (!expenses) {
        return res.status(400).json({
          success: true,
          error: "error while fetching expense",
          message: "expenses related to event have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpenseTotalAmount(req, res) {
    try {
      const totalAmount = await EXPENSE.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

      if (totalAmount) {
        return res.status(200).json({
          success: true,
          data: totalAmount,
          message: "totalAmount has been fetched",
        });
      }

      if (!totalAmount) {
        return res.status(404).json({
          success: true,
          error: "error while fetching totalAmount",
          message: "totalAmount has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpenseAmountPaid(req, res) {
    try {
      const paidAmount = await EXPENSE.aggregate([
        {
          $group: {
            _id: null,
            totalPaidAmount: {
              $sum: "$paidAmount",
            },
          },
        },
      ]);

      if (paidAmount) {
        return res.status(200).json({
          success: true,
          data: paidAmount,
          message: "paidAmount has been fetched",
        });
      }

      if (!paidAmount) {
        return res.status(404).json({
          success: true,
          error: "error while fetching paidAmount",
          message: "paidAmount has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetExpenseBasedOnPriority(req, res) {
    try {
      const priority = req.params.priority;
      const priorityWisedExpenses = await EXPENSE.find({ priority: priority });

      if (priorityWisedExpenses) {
        return res.status(200).json({
          success: true,
          data: priorityWisedExpenses,
          message: "priorityWisedExpenses have been fetched",
        });
      }

      if (!priorityWisedExpenses) {
        return res.status(404).json({
          success: true,
          error: "error while fetching priorityWisedExpenses",
          message: "priorityWisedExpenses have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }

  // payments
  static async handleCreatePayment(req, res) {
    try {
      const data = req.body;
      const payment = await PAYMENTS.create({
        eventId: req.params.event_id,
        expenseId: req.params.expense_id,
        vendorId: req.params.vendor_id,
        ...data,
      });

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payment has been made",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while creating payment",
          message: "payment has not been made",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetAllPayment(req, res) {
    try {
      const payment = await PAYMENTS.find({});

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payments have been fetched",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while fetching payments",
          message: "payments have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPaymentByMethod(req, res) {
    try {
      const method = req.params.method;
      const payments = await PAYMENTS.find({ paymentMethod:method }, {});

      if (payments) {
        return res.status(201).json({
          success: true,
          data: payments,
          message: "payments have been fetched",
        });
      }

      if (!payments) {
        return res.status(400).json({
          success: true,
          error: "error while creating payment",
          message: "payments have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPaymentByEvent(req, res) {
    try {
      const payment = await PAYMENTS.findOne({ eventId: req.params.event_id });

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payment has been fetched",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while fetching payment",
          message: "payment has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPaymentByVendor(req, res) {
    try {
      const payments = await PAYMENTS.find(
        { vendorId: req.params.vendor_id },
        {},
      );

      if (payments) {
        return res.status(201).json({
          success: true,
          data: payments,
          message: "payments have been fetched",
        });
      }

      if (!payments) {
        return res.status(400).json({
          success: true,
          error: "error while creating payment",
          message: "payments have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPaymentByStatus(req, res) {
    try {
      const status = req.params.status;
      const payment = await PAYMENTS.find({ status: status });

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payment based on status has been fetched",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while creating payment",
          message: "payment based on status has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPaymentByType(req, res) {
    try {
      const type = req.params.type;
      const payments = await PAYMENTS.find({ paymentType: type });
      if (payments) {
        return res.status(201).json({
          success: true,
          data: payments,
          message: "payments have been fetched",
        });
      }

      if (!payments) {
        return res.status(400).json({
          success: true,
          error: "error while creating payment",
          message: "payment have not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleGetPayment(req, res) {
    try {
      const payment = await PAYMENTS.findOne({
        expenseId: req.params.id,
      });

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payment has been fetched",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while fetching the payment",
          message: "payment has not been fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
  
  static async handleDeletePayment(req, res) {
    try {
      const payment = await PAYMENTS.findByIdAndDelete({ _id: req.params.id });

      if (payment) {
        return res.status(201).json({
          success: true,
          data: payment,
          message: "payment has been deleted",
        });
      }

      if (!payment) {
        return res.status(400).json({
          success: true,
          error: "error while deleting payment",
          message: "payment has not been deleted",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
        message: "internal server error",
      });
    }
  }
}
export default ExpenseController;
