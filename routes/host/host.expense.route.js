import { Router } from "express";
import ExpenseController from "../../controllers/host/expense.controller.js";
import ExpenseValidator from "../../validator/expense.validator.js";
import upload from "../../middlewares/upload.middleware.js";
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

    this.getExpenseByVendor();
    this.getExpenseByEvent();
    this.getExpenseTotalAmount();
    this.getExpenseAmountPaid();
    this.getAllExpense();
    this.getExpenseBasedonPriority();
    this.getExpense();
    this.createExpense();
    this.updateExpense();
    this.deleteExpense();

    this.getAllPayment();
    this.getPaymentByMethod();
    this.getPaymentByEvent();
    this.getPaymentByVendor();
    this.getPaymentByStatus();
    this.getPaymentByType();
    this.getPayment();
    this.createPayment();
    this.deletePayment();
  }

  createBudget() {
    this.router.post(
      "/budget/:eventId/",
      ExpenseValidator.HandleBugetValidation,
      ExpenseController.handleCreateBudget,
    );
  }
  getAllBudget() {
    this.router.get(
      "/budget/:eventId/all",
      ExpenseController.handleGetAllBudget,
    );
  }
  totalBudgetAmount() {
    this.router.get(
      "/budget/totalAmount",
      ExpenseController.handleTotalBudgetAmount,
    );
  }
  categoryWiseBudget() {
    this.router.get(
      "/budget/category/:category",
      ExpenseController.handleCategoryWiseBudget,
    );
  }
  budgetByEvent() {
    this.router.get(
      "/budget/event/:eventId",
      ExpenseController.handleBudgetByEvent,
    );
  }
  approvedBudgets() {
    this.router.get(
      "/budget/:eventId/approved",
      ExpenseController.handleApprovedBudgets,
    );
  }
  closedBudget() {
    this.router.get(
      "/budget/:eventId/closed",
      ExpenseController.handleClosedBudget,
    );
  }
  draftedBudget() {
    this.router.get(
      "/budget/:eventId/drafted",
      ExpenseController.handleDraftedBudget,
    );
  }
  getBudget() {
    this.router.get("/budget/:eventId/:id", ExpenseController.handleGetBudget);
  }
  updateBudget() {
    this.router.patch(
      "/budget/:eventId/:id",
      ExpenseController.handleUpdateBudget,
    );
  }
  deleteBudget() {
    this.router.delete(
      "/budget/:eventId/:id",
      ExpenseController.handleDeleteBudget,
    );
  }

  createExpense() {
    this.router.post(
      "/:eventId/:budgetId/",
      ExpenseValidator.HandleExpenseValidation,
      ExpenseController.handleCreateExpense,
    );
  }
  getAllExpense() {
    this.router.get("/:eventId/all", ExpenseController.handleGetAllExpense);
  }
  getExpenseByVendor() {
    this.router.get(
      "/:eventId/vendor/:name",
      ExpenseController.handleGetExpenseByVendor,
    );
  }
  getExpenseByEvent() {
    this.router.get(
      "/event/:eventId/",
      ExpenseController.handleGetExpenseByEvent,
    );
  }
  getExpenseTotalAmount() {
    this.router.get(
      "/:eventId/totalAmount",
      ExpenseController.handleGetExpenseTotalAmount,
    );
  }
  getExpenseAmountPaid() {
    this.router.get(
      "/:eventId/amountPaid",
      ExpenseController.handleGetExpenseAmountPaid,
    );
  }
  getExpenseBasedonPriority() {
    this.router.get(
      "/:eventId/priority/:priority",
      ExpenseController.handleGetExpenseBasedOnPriority,
    );
  }
  getExpense() {
    this.router.get("/:eventId/:id", ExpenseController.handleGetExpense);
  }
  updateExpense() {
    this.router.patch("/:eventId/:id", ExpenseController.handleUpdateExpense);
  }
  deleteExpense() {
    this.router.delete(
      "/:eventId/:id",
      ExpenseController.handleDeleteExpense,
    );
  }

  createPayment() {
    this.router.post(
      "/payment/:eventId/:expenseId/:vendorId/",
      ExpenseValidator.HandlePaymentsValidation,
      ExpenseController.handleCreatePayment,
    );
  }
  getAllPayment() {
    this.router.get(
      "/payment/:eventId/all",
      ExpenseController.handleGetAllPayment,
    );
  }
  getPaymentByMethod() {
    this.router.get(
      "/payment/:eventId/method/:method",
      ExpenseController.handleGetPaymentByMethod,
    );
  }
  getPaymentByEvent() {
    this.router.get(
      "/payment/:eventId",
      ExpenseController.handleGetPaymentByEvent,
    );
  }
  getPaymentByVendor() {
    this.router.get(
      "/payment/:eventId/vendor/:vendorId",
      ExpenseController.handleGetPaymentByVendor,
    );
  }
  getPaymentByStatus() {
    this.router.get(
      "/payment/:eventId/status/:status",
      ExpenseController.handleGetPaymentByStatus,
    );
  }
  getPaymentByType() {
    this.router.get(
      "/payment/:eventId/type/:type",
      ExpenseController.handleGetPaymentByType,
    );
  }
  getPayment() {
    this.router.get(
      "/payment/:eventId/:id",
      ExpenseController.handleGetPayment,
    );
  }
  deletePayment() {
    this.router.delete(
      "/payment/:eventId/:expenseId/:id",
      ExpenseController.handleDeletePayment,
    );
  }
}

export default new HostExpenseRoutes().router;
