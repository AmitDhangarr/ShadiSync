import BUDGET from "./../../models/host/expense/buget.modal.js";
import EXPENSE from "../../models/host/expense/expense.modal.js";
import PAYMENTS from "../../models/host/expense/payments.modal.js";
import EVENT from "../../models/host/event/event.modal.js";

class ExpenseController {
  static async handleCreateBudget(req, res) {
    try {
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

      const isEventExists = await EVENT.findById(req.params.event_id);

      if (!isEventExists) {
        return res.status(400).json({
          success: false,
          message: "Event does not exist, create event first",
        });
      }

      const budget = await BUDGET.create({
        eventId: req.params.event_id,
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

      await EVENT.findByIdAndUpdate(req.params.event_id, {
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
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetAllBudget(req, res) {
    try {
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
      const budget = await BUDGET.findById(req.params.id);

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

      const oldBudget = await BUDGET.findById(req.params.id);

      if (!oldBudget) {
        return res.status(404).json({
          success: false,
          message: "Budget not found. Please check the ID.",
        });
      }

      const consumedDiff = Number(consumedAmount) - oldBudget.consumedAmount;

      const updatedBudget = await BUDGET.findByIdAndUpdate(
        req.params.id,
        {
          status,
          consumedAmount: Number(consumedAmount),
          remainingAmount: oldBudget.allocatedAmount - Number(consumedAmount),
        },
        { new: true },
      );

      const updateEvent = await EVENT.findByIdAndUpdate(oldBudget.eventId, {
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
      const budget = await BUDGET.findByIdAndDelete(req.params.id);

      if (!budget) {
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
      const budget = await BUDGET.findOne({ eventId: req.params.event_id });

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
      const budgets = await BUDGET.find({ status: "Approved" });

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
      const budgets = await BUDGET.find({ status: "Closed" });

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
      const budgets = await BUDGET.find({ status: "Draft" });

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

  // ── EXPENSE ─────────────────

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

      const event = await EVENT.findById(req.params.event_id);

      if (!event) {
        return res.status(400).json({
          success: false,
          message: "eventId is not valid",
        });
      }

      const budget = await BUDGET.findById(req.params.budget_id);

      if (!budget) {
        return res.status(400).json({
          success: false,
          message: "budgetId is not valid",
        });
      }

      const expenseRemainingAmount = totalAmount - paidAmount;

      const expense = await EXPENSE.create({
        eventId: req.params.event_id,
        budgetId: req.params.budget_id,
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
        const updateBudget = await BUDGET.findByIdAndUpdate(
          req.params.budget_id,
          {
            $inc: { consumedAmount: totalAmount },
            $set: { remainingAmount: budgetRemainingAmount },
          },
        );

        if (!updateBudget) {
          return res.status(400).json({
            success: false,
            message: "Error while updating the budget.",
          });
        }

        const updateEvent = await EVENT.findByIdAndUpdate(req.params.event_id, {
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
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpense(req, res) {
    try {
      const expense = await EXPENSE.findById(req.params.id);

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
      const {
        status,
        paymentStatus,
        priority,
        attachments,
        totalAmount,
        paidAmount,
      } = req.body;
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

      const oldExpense = await EXPENSE.findById(req.params.id);

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

      const expense = await EXPENSE.findByIdAndUpdate(
        req.params.id,
        {
          status,
          paymentStatus,
          priority,
          attachments,
          totalAmount: newTotal,
          paidAmount: newPaid,
          remainingAmount: newRemainingAmount,
        },
        { new: true, runValidators: true },
      );

      await BUDGET.findByIdAndUpdate(oldExpense.budgetId, {
        $inc: {
          consumedAmount: totalDiff,
          remainingAmount: -totalDiff,
        },
      });

      await EVENT.findByIdAndUpdate(oldExpense.eventId, {
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
      const expense = await EXPENSE.findByIdAndDelete(req.params.id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: expense,
        message: "Expense deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleGetExpenseByVendor(req, res) {
    try {
      const expenses = await EXPENSE.find({
        "vendor.vendorId": req.params.vendor_id,
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
      const expenses = await EXPENSE.find({ eventId: req.params.event_id });

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

      const isEventExits = await EVENT.findById(req.params.event_id);

      if (!isEventExits) {
        return res.status(400).json({
          success: false,
          message: "Event does not found.",
        });
      }

      const isExpenseExits = await EXPENSE.findById(req.params.expense_id);

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
        eventId: req.params.event_id,
        expenseId: req.params.expense_id,
        vendorId: isExpenseExits.vendor.vendorId,
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
        req.params.expense_id,
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

      const updateEvent = await EVENT.findByIdAndUpdate(req.params.event_id, {
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
      console.log(error);
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
      const payment = await PAYMENTS.findOne({ eventId: req.params.event_id });

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
      const payment = await PAYMENTS.findOne({ expenseId: req.params.id });

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
      const payment = await PAYMENTS.findByIdAndDelete(req.params.id);

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
