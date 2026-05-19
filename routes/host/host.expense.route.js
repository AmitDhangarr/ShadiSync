import { Router } from "express";
import ExpenseController from "../../controllers/host/expense.controller.js";
import ExpenseValidator from "../../validator/expense.validator.js";
class HostExpenseRoutes {
  router = null;

  constructor() {
    this.router = Router();

    this.createBudget();
    this.totalBudgetAmount();
    this.categoryWiseBudget();
    this.approvedBudgets();
    this.closedBudget();
    this.draftedBudget();
    this.budgetByEvent();
    this.getAllBudget();
    this.getBudget();
    this.updateBudget();
    this.deleteBudget();

    this.createExpense();
    this.getAllExpense();
    this.getExpenseByVendor();
    this.getExpenseByEvent();
    this.getExpenseTotalAmount();
    this.getExpenseAmountPaid();
    this.getExpenseBasedonPriority();
    this.getExpense();
    this.updateExpense();
    this.deleteExpense();

    this.createPayment();
    this.getAllPayment();
    this.getPaymentByMethod();
    this.getPaymentByEvent();
    this.getPaymentByVendor();
    this.getPaymentByStatus();
    this.getPaymentByType();
    this.getPayment();
    this.updatePayment();
    this.deletePayment();
  }

  createBudget() {
    this.router.post(
      "/budget/:event_id/",
      ExpenseValidator.HandleBugetValidation,
      ExpenseController.handleCreateBudget,
    );
  }
  getAllBudget() {
    this.router.get("/budget", ExpenseController.handleGetAllBudget);
  }
  totalBudgetAmount() {
    this.router.get(
      "/budget/totalAmount",
      ExpenseController.handleTotalBudgetAmount,
    );
  }
  categoryWiseBudget() {
    this.router.get("/budget/category/:category", ExpenseController.handleCategoryWiseBudget);
  }
  budgetByEvent() {
    this.router.get(
      "/budget/event/:event_id",
      ExpenseController.handleBudgetByEvent,
    );
  }
  approvedBudgets() {
    this.router.get(
      "/budget/approved",
      ExpenseController.handleApprovedBudgets,
    );
  }
  closedBudget() {
    this.router.get("/budget/closed", ExpenseController.handleClosedBudget);
  }
  draftedBudget() {
    this.router.get("/budget/drafted", ExpenseController.handleDraftedBudget);
  }
  getBudget() {
    this.router.get("/budget/:id", ExpenseController.handleGetBudget);
  }
  updateBudget() {
    this.router.patch("/budget/:id", ExpenseController.handleUpdateBudget);
  }
  deleteBudget() {
    this.router.delete("/budget/:id", ExpenseController.handleDeleteBudget);
  }

  createExpense() {
    this.router.post(
      "/",
      ExpenseValidator.HandleExpenseValidation,
      ExpenseController.handleCreateExpense,
    );
  }
  getAllExpense() {
    this.router.get("/all", ExpenseController.handleGetAllExpense);
  }
  getExpenseByVendor() {
    this.router.get(
      "/vendor/:vendor_id",
      ExpenseController.handleGetExpenseByVendor,
    );
  }
  getExpenseByEvent() {
    this.router.get(
      "/event/:event_id",
      ExpenseController.handleGetExpenseByEvent,
    );
  }
  getExpenseTotalAmount() {
    this.router.get(
      "/totalAmount",
      ExpenseController.handleGetExpenseTotalAmount,
    );
  }
  getExpenseAmountPaid() {
    this.router.get(
      "/amountPaid",
      ExpenseController.handleGetExpenseAmountPaid,
    );
  }
  getExpenseBasedonPriority() {
    this.router.get(
      "/priority/:priority",
      ExpenseController.handleGetExpenseBasedOnPriority,
    );
  }
  getExpense() {
    this.router.get("/:id", ExpenseController.handleGetExpense);
  }
  updateExpense() {
    this.router.patch("/:id", ExpenseController.handleUpdateExpense);
  }
  deleteExpense() {
    this.router.delete("/:id", ExpenseController.handleDeleteExpense);
  }

  createPayment() {
    this.router.post(
      "/payment",
      ExpenseValidator.HandlePaymentsValidation,
      ExpenseController.handleCreatePayment,
    );
  }
  getAllPayment() {
    this.router.get("/payment/all", ExpenseController.handleGetAllPayment);
  }
  getPaymentByMethod() {
    this.router.get(
      "/payment/method/:method",
      ExpenseController.handleGetPaymentByMethod,
    );
  }
  getPaymentByEvent() {
    this.router.get(
      "/payment/event/:event_id",
      ExpenseController.handleGetPaymentByEvent,
    );
  }
  getPaymentByVendor() {
    this.router.get(
      "/payment/vendor/:vendor_id",
      ExpenseController.handleGetPaymentByVendor,
    );
  }
  getPaymentByStatus() {
    this.router.get(
      "/payment/status/:status",
      ExpenseController.handleGetPaymentByStatus,
    );
  }
  getPaymentByType() {
    this.router.get(
      "/payment/type/:type",
      ExpenseController.handleGetPaymentByType,
    );
  }
  getPayment() {
    this.router.get("/payment/:id", ExpenseController.handleGetPayment);
  }
  updatePayment() {
    this.router.patch("/payment/:id", ExpenseController.handleUpdatePayment);
  }
  deletePayment() {
    this.router.delete("/payment/:id", ExpenseController.handleDeletePayment);
  }
}

export default new HostExpenseRoutes().router;
