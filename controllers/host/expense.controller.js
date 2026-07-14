import BUDGET from "./../../models/host/expense/buget.modal.js";
import EXPENSE from "../../models/host/expense/expense.modal.js";
import PAYMENTS from "../../models/host/expense/payments.modal.js";
import EVENT from "../../models/host/event/event.modal.js";
import { nanoid } from "nanoid";
class ExpenseController {
  static async handleCreateBudget(req, res) {
    try {
      const id = req.params.eventId;
      const {
        category,
        subCategory,
        allocatedAmount,
        revisedAmount,
        consumedAmount,
        remainingAmount,
        status,
        notes,
        approvedBy,
        approvedAt,
        createdBy,
        updatedBy,
        budgetCode,
        title,
        budgetType,
        functionId,
        startDate,
        endDate,
        isLocked,
      } = req.body;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.create({
        eventId: id,
        budgetId: nanoid(),
        category,
        subCategory,
        allocatedAmount,
        revisedAmount,
        consumedAmount,
        remainingAmount,
        status,
        notes,
        approvedBy,
        approvedAt,
        createdBy,
        updatedBy,
        budgetCode,
        title,
        budgetType,
        functionId,
        startDate,
        endDate,
        isLocked,
      });

      if (!budget) {
        return res.status(400).json({
          success: false,
          message: "Budget could not be created",
        });
      }

      await EVENT.findByIdAndUpdate(event._id, {
        $inc: {
          "budgetSummary.totalAllocated": allocatedAmount,
          "budgetSummary.totalRemaining": allocatedAmount,
        },
      });

      return res.status(201).json({
        success: true,
        data: budget,
        message: "Budget created successfully.",
      });
    } catch (error) {
      if (err && error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "Expense with ID already exits. Please try new one.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetAllBudget(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budgets = await BUDGET.find({});

      return res.status(200).json({
        success: true,
        data: budgets,
        message:
          budgets.length === 0
            ? "No budgets found."
            : "Budgets fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetBudget(req, res) {
    try {
      const id = req.params.eventId;
      const budgetId = req.params.id;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }
      const budget = await BUDGET.findOne({ budgetId: budgetId });

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: budget,
        message: "Budget fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleUpdateBudget(req, res) {
    try {
      const id = req.params.eventId;
      const budgetId = req.params.id;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.findOne({ budgetId: budgetId });

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      const { consumedAmount, status } = req.body;
      const allowedStatuses = ["Draft", "Approved", "Closed"];
      const errors = {};

      if (status === undefined) {
        errors.status = "Status is required.";
      } else if (!allowedStatuses.includes(status)) {
        errors.status = "Invalid status. Use Draft, Approved, or Closed.";
      }

      if (consumedAmount === undefined) {
        errors.consumedAmount = "Consumed amount is required.";
      } else if (isNaN(consumedAmount)) {
        errors.consumedAmount = "Consumed amount must be a number.";
      } else if (Number(consumedAmount) < 0) {
        errors.consumedAmount = "Consumed amount cannot be negative.";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          errors,
          message: "Validation failed. Please fix the errors and try again.",
        });
      }

      const oldBudget = await BUDGET.findById(budget._id);

      if (!oldBudget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      const consumedDiff = Number(consumedAmount) - oldBudget.consumedAmount;

      const updatedBudget = await BUDGET.findByIdAndUpdate(budget._id, {
        status,
        consumedAmount: Number(consumedAmount),
        remainingAmount: oldBudget.allocatedAmount - Number(consumedAmount),
      });

      const updateEvent = await EVENT.findByIdAndUpdate(event._id, {
        $inc: {
          "budgetSummary.totalConsumed": consumedDiff,
          "budgetSummary.totalRemaining": -consumedDiff,
        },
      });

      if (!updateEvent) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while updating event.",
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedBudget,
        message: "Budget updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleDeleteBudget(req, res) {
    try {
      const id = req.params.eventId;
      const budgetId = req.params.id;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.findOne({ budgetId: budgetId });

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      const deletedBudget = await BUDGET.findByIdAndDelete(budget._id);

      if (!deletedBudget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: budget,
        message: "Budget deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleTotalBudgetAmount(req, res) {
    try {
      const totalBudget = await BUDGET.aggregate([
        { $group: { _id: null, totalBudget: { $sum: "$revisedAmount" } } },
      ]);
      if (!totalBudget) {
        return res.status(404).json({
          success: false,
          message: "Total budgetamount is not fetched successfully.",
        });
      }
      return res.status(200).json({
        success: true,
        data: totalBudget,
        message: "Total budget amount fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleCategoryWiseBudget(req, res) {
    try {
      const budget = await BUDGET.findOne({ category: req.params.category });

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "No budget found for this category.",
        });
      }

      return res.status(200).json({
        success: true,
        data: budget,
        message: "Category budget fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleBudgetByEvent(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: req.params.eventId });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.findOne({ eventId: id });

      if (!budget) {
        return res.status(404).json({
          success: false,
          message: "No budget found for this event.",
        });
      }

      return res.status(200).json({
        success: true,
        data: budget,
        message: "Event budget fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleApprovedBudgets(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budgets = await BUDGET.find({ eventId: id, status: "Approved" });

      return res.status(200).json({
        success: true,
        data: budgets,
        message:
          budgets.length === 0
            ? "No approved budgets found."
            : "Approved budgets fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleClosedBudget(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budgets = await BUDGET.find({ eventId: id, status: "Closed" });

      return res.status(200).json({
        success: true,
        data: budgets,
        message:
          budgets.length === 0
            ? "No closed budgets found."
            : "Closed budgets fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleDraftedBudget(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }
      const budgets = await BUDGET.find({ eventId: id, status: "Draft" });

      return res.status(200).json({
        success: true,
        data: budgets,
        message:
          budgets.length === 0
            ? "No draft budgets found."
            : "Draft budgets fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleCreateExpense(req, res) {
    const file = req.file || "none";
    try {
      const {
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
      } = req.body;

      const id = req.params.eventId;
      const budgetId = req.params.budgetId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.findOne({ budgetId: budgetId });

      if (!budget) {
        return res.status(400).json({
          success: false,
          message: "budgetId is not valid",
        });
      }

      const expenseRemainingAmount = totalAmount - paidAmount;

      const expense = await EXPENSE.create({
        eventId: req.params.eventId,
        budgetId: req.params.budgetId,
        expenseId: nanoid(),
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
        remainingAmount: expenseRemainingAmount,
        status,
        paymentStatus,
        priority,
        expenseDate,
        bookingDate,
        dueDate,
        serviceDate,
        attachments: {
          type: file.type,
          fileUrl: file.path,
          fileName: file.fieldname,
        },
        requestedBy,
        approvedBy,
        approvalDate,
        remarks,
      });

      const budgetRemainingAmount = budget.allocatedAmount - totalAmount;

      if (expense) {
        const updateBudget = await BUDGET.findByIdAndUpdate(budget._id, {
          $inc: { consumedAmount: totalAmount },
          $set: { remainingAmount: budgetRemainingAmount },
        });

        if (!updateBudget) {
          return res.status(400).json({
            success: false,
            message: "Error while updating the budget.",
          });
        }

        const updateEvent = await EVENT.findByIdAndUpdate(event._id, {
          $inc: {
            "budgetSummary.totalConsumed": totalAmount,
            "budgetSummary.totalRemaining": -totalAmount,
            "expenseSummary.totalEstimated": estimatedAmount,
            "expenseSummary.totalActual": totalAmount,
            "expenseSummary.totalPaid": paidAmount,
            "expenseSummary.totalRemaining": expenseRemainingAmount,
            "expenseSummary.totalTax": taxAmount,
            "expenseSummary.totalDiscount": discountAmount,
          },
        });

        if (!updateEvent) {
          return res.status(400).json({
            success: false,
            message: "Error while updating the event.",
          });
        }
      }

      return res.status(201).json({
        success: true,
        data: expense,
        message: "Expense created successfully.",
      });
    } catch (error) {
      if (err && error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "Expense with ID already exits. Please try new one.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpense(req, res) {
    try {
      const id = req.params.eventId;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const Expense = await EXPENSE.findOne({ eventId: id });

      if (!Expense) {
        return res.status(400).json({
          success: false,
          message: "Expense does not exist, register expense first",
        });
      }

      const expense = await EXPENSE.findById(Expense._id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: expense,
        message: "Expense fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetAllExpense(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const expenses = await EXPENSE.find({});

      return res.status(200).json({
        success: true,
        data: expenses,
        message:
          expenses.length === 0
            ? "No expenses found."
            : "Expenses fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleUpdateExpense(req, res) {
    try {
      const id = req.params.eventId;
      const expenseId = req.params.id;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const {
        status,
        paymentStatus,
        priority,
        attachments,
        totalAmount,
        paidAmount,
      } = req.body || {};

      const errors = {};

      if (!status || status.trim() === "")
        errors.status = "Status is required.";
      if (!paymentStatus || paymentStatus.trim() === "")
        errors.paymentStatus = "Payment status is required.";
      if (!priority || priority.trim() === "")
        errors.priority = "Priority is required.";
      if (!attachments || String(attachments).trim() === "")
        errors.attachments = "Attachments are required.";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          errors,
          message: "Validation failed. Please fix the errors and try again.",
        });
      }

      const oldExpense = await EXPENSE.findOne({ expenseId: expenseId });

      if (!oldExpense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found. Please check the ID.",
        });
      }

      const oldTotal = oldExpense.totalAmount;
      const oldPaid = oldExpense.paidAmount;
      const newTotal = totalAmount ?? oldTotal;
      const newPaid = paidAmount ?? oldPaid;
      const totalDiff = newTotal - oldTotal;
      const paidDiff = newPaid - oldPaid;
      const newRemainingAmount = newTotal - newPaid;

      const expense = await EXPENSE.findByIdAndUpdate(oldExpense._id, {
        status,
        paymentStatus,
        priority,
        attachments,
        totalAmount: newTotal,
        paidAmount: newPaid,
        remainingAmount: newRemainingAmount,
      });

      await BUDGET.findByIdAndUpdate(oldExpense._id, {
        $inc: {
          consumedAmount: totalDiff,
          remainingAmount: -totalDiff,
        },
      });

      await EVENT.findByIdAndUpdate(event._id, {
        $inc: {
          "budgetSummary.totalConsumed": totalDiff,
          "budgetSummary.totalRemaining": -totalDiff,
          "expenseSummary.totalActual": totalDiff,
          "expenseSummary.totalPaid": paidDiff,
          "expenseSummary.totalRemaining": -paidDiff,
        },
      });

      return res.status(200).json({
        success: true,
        data: expense,
        message: "Expense updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleDeleteExpense(req, res) {
    try {
      const id = req.params.eventId;
      const expenseId = req.params.id;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const expense = await EXPENSE.findOne({ expenseId: expenseId });

      if (!expense) {
        return res.status(400).json({
          success: false,
          message: "expense does not exist",
        });
      }

      const deletedExpense = await EXPENSE.findByIdAndDelete(expense._id);

      if (!deletedExpense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: deletedExpense,
        message: "Expense deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseByVendor(req, res) {
    try {
      const id = req.params.eventId;
      const name = req.params.name;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const expenses = await EXPENSE.find({
        "vendor.contactPerson": req.params.name,
      });

      return res.status(200).json({
        success: true,
        data: expenses,
        message:
          expenses.length === 0
            ? "No expenses found for this vendor."
            : "Vendor expenses fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseByEvent(req, res) {
    try {
      const id = req.params.eventId;

      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const expenses = await EXPENSE.find({ eventId: id });

      return res.status(200).json({
        success: true,
        data: expenses,
        message:
          expenses.length === 0
            ? "No expenses found for this event."
            : "Event expenses fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseTotalAmount(req, res) {
    try {
      const totalAmount = await EXPENSE.aggregate([
        { $group: { _id: null, totalAmount: { $sum: "$totalAmount" } } },
      ]);

      return res.status(200).json({
        success: true,
        data: totalAmount,
        message: "Total expense amount fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseAmountPaid(req, res) {
    try {
      const paidAmount = await EXPENSE.aggregate([
        { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } },
      ]);

      return res.status(200).json({
        success: true,
        data: paidAmount,
        message: "Total paid amount fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseBasedOnPriority(req, res) {
    try {
      const expenses = await EXPENSE.find({ priority: req.params.priority });

      return res.status(200).json({
        success: true,
        data: expenses,
        message:
          expenses.length === 0
            ? "No expenses found for this priority."
            : "Priority expenses fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  // ── PAYMENTS ─────────────────────────────────────────────────────────────

  static async handleCreatePayment(req, res) {
    try {
      const {
        paymentCode,
        amount,
        paymentType,
        paymentMethod,
        transactionReference,
        paymentDate,
        status,
        attachments,
        notes,
      } = req.body;

      const id = req.params.eventId;
      const expenseId = req.params.expenseId;
      const vendorId = req.params.vendorId;

      const isEventExits = await EVENT.findOne({ eventId: id });

      if (!isEventExits) {
        return res.status(400).json({
          success: false,
          message: "Event does not found.",
        });
      }

      const isExpenseExits = await EXPENSE.findOne({ expenseId: expenseId });

      if (!isExpenseExits) {
        return res.status(400).json({
          success: false,
          message: "Expense does not found.",
        });
      }

      const isVendorExits = isExpenseExits.vendor.vendorId;

      if (!isVendorExits) {
        return res.status(400).json({
          success: false,
          message: "Vendor does not exist.",
        });
      }

      const payment = await PAYMENTS.create({
        eventId: req.params.eventId,
        expenseId: req.params.expenseId,
        vendorId: isExpenseExits.vendor.vendorId,
        paymentId: nanoid(),
        paymentCode,
        amount,
        paymentType,
        paymentMethod,
        transactionReference,
        paymentDate,
        status,
        attachments,
        notes,
      });

      if (!payment) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while recording payment.",
        });
      }

      const newPaidAmount = isExpenseExits.paidAmount + amount;
      const newRemainingAmount = isExpenseExits.totalAmount - newPaidAmount;

      const updateExpense = await EXPENSE.findByIdAndUpdate(
        isExpenseExits._id,
        {
          $inc: { paidAmount: amount },
          $set: {
            remainingAmount: newRemainingAmount,
            paymentStatus:
              newRemainingAmount <= 0
                ? "Paid"
                : newPaidAmount > 0
                  ? "Partial"
                  : "Unpaid",
          },
        },
        { new: true },
      );

      if (!updateExpense) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while updating expense.",
        });
      }

      const updateEvent = await EVENT.findByIdAndUpdate(isEventExits._id, {
        $inc: {
          "expenseSummary.totalPaid": amount,
          "expenseSummary.totalRemaining": -amount,
        },
      });

      if (!updateEvent) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong while updating event.",
        });
      }

      return res.status(201).json({
        success: true,
        data: payment,
        message: "Payment created successfully.",
      });
    } catch (error) {
      if (err && error.code === 11000) {
        return res.status(500).json({
          success: false,
          message: "Payment with ID already exits. Please try new one.",
        });
      }
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetAllPayment(req, res) {
    try {
      const payments = await PAYMENTS.find({});

      return res.status(200).json({
        success: true,
        data: payments,
        message:
          payments.length === 0
            ? "No payments found."
            : "Payments fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPaymentByMethod(req, res) {
    try {
      const payments = await PAYMENTS.find({
        paymentMethod: req.params.method,
      });

      return res.status(200).json({
        success: true,
        data: payments,
        message:
          payments.length === 0
            ? "No payments found for this method."
            : "Payments fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPaymentByEvent(req, res) {
    try {
      const id = req.params.eventId;
      console.log(id);
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }
      const payment = await PAYMENTS.findOne({ eventId: id });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "No payment found for this event.",
        });
      }

      return res.status(200).json({
        success: true,
        data: payment,
        message: "Payment fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPaymentByVendor(req, res) {
    try {
      const payments = await PAYMENTS.find({ vendorId: req.params.vendor_id });

      return res.status(200).json({
        success: true,
        data: payments,
        message:
          payments.length === 0
            ? "No payments found for this vendor."
            : "Vendor payments fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPaymentByStatus(req, res) {
    try {
      const payments = await PAYMENTS.find({ status: req.params.status });

      return res.status(200).json({
        success: true,
        data: payments,
        message:
          payments.length === 0
            ? "No payments found for this status."
            : "Payments fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPaymentByType(req, res) {
    try {
      const payments = await PAYMENTS.find({ paymentType: req.params.type });

      return res.status(200).json({
        success: true,
        data: payments,
        message:
          payments.length === 0
            ? "No payments found for this type."
            : "Payments fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetPayment(req, res) {
    try {
      const id = req.params.eventId;
      const paymentId = req.params.id;
      const event = await EVENT.findOne({ eventId: id });

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const payment = await PAYMENTS.findOne({ paymentId: paymentId });

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: payment,
        message: "Payment fetched successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleDeletePayment(req, res) {
    try {
      const id = req.params.eventId;
      const event = await EVENT.findOne({ eventId: id });
      const expenseId = req.params.expenseId;

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const isExpenseExits = await EXPENSE.findOne({ expenseId: expenseId });

      if (!isExpenseExits) {
        return res.status(400).json({
          success: false,
          message: "Expense does not found.",
        });
      }

      
      const isPaymentExits = await PAYMENTS.findOne({ expenseId: expenseId });

      if (!isPaymentExits) {
        return res.status(400).json({
          success: false,
          message: "Expense does not found.",
        });
      }
     
      const payment = await PAYMENTS.findByIdAndDelete(isPaymentExits._id);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: payment,
        message: "Payment deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

export default ExpenseController;
