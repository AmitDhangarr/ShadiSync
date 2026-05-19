import BUDGET from "./../../models/host/expense/buget.modal.js";
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
      const categoryWiseBudget = await BUDGET.findOne({category:category});

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
    return res.json({ successful: true });
  }
  static async handleGetExpense(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetAllExpense(req, res) {
    return res.json({ successful: true });
  }
  static async handleUpdateExpense(req, res) {
    return res.json({ successful: true });
  }
  static async handleDeleteExpense(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetExpenseByVendor(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetExpenseByEvent(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetExpenseTotalAmount(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetExpenseAmountPaid(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetExpenseBasedOnPriority(req, res) {
    return res.json({ successful: true });
  }

  // payments
  static async handleCreatePayment(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetAllPayment(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPaymentByMethod(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPaymentByEvent(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPaymentByVendor(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPaymentByStatus(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPaymentByType(req, res) {
    return res.json({ successful: true });
  }
  static async handleGetPayment(req, res) {
    return res.json({ successful: true });
  }
  static async handleUpdatePayment(req, res) {
    return res.json({ successful: true });
  }
  static async handleDeletePayment(req, res) {
    return res.json({ successful: true });
  }
}
export default ExpenseController;
