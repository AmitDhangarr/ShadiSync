import { Router } from "express";
import ExpenseController from "../../controllers/host/expense.controller.js";
class HostExpenseRoutes {
  router = null;

  constructor() {
    this.router = Router();
    // budget
    this.createBudget();
    this.getAllBudget();
    this.totalBudgetAmount();
    this.eventWiseBudget();
    this.budgetByEvent();
    this.approvedBudgets();
    this.cancelledBudget();
    this.draftedBudget();
    this.getBudget();
    this.updateBudget();
    this.deleteBudget();
    // Expenses
    this.createExpense();
    this.getExpense();
    this.getAllExpense();
    this.updateExpense();
    this.deleteExpense();
    this.getExpenseByVendor();
    this.getExpenseByEvent();
    this.getExpenseTotalAmount();
    this.getExpenseAmountPaid();
    this.getExpenseBasedonPriority();
    // Payments
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

  // Budget

  createBudget() {
    this.router.post("/budget", ExpenseController.handleCreateBudget);
  }
  getBudget() {
    this.router.get("/budget/:id", ExpenseController.handleGetBudget);
  }
  getAllBudget() {
    this.router.get("/budget", ExpenseController.handleGetAllBudget);
  }
  updateBudget() {
    this.router.patch("/budget/:id", ExpenseController.handleUpdateBudget);
  }
  deleteBudget() {
    this.router.delete("/budget/:id", ExpenseController.handleDeleteBudget);
  }
  totalBudgetAmount() {
    this.router.get(
      "/budget/totalAmount",
      ExpenseController.handleTotalBudgetAmount,
    );
  }
  eventWiseBudget() {
    this.router.get("/budget/events", ExpenseController.handleEventWiseBudget);
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
  cancelledBudget() {
    this.router.get(
      "/budget/cancelled",
      ExpenseController.handleCancelledBudget,
    );
  }
  draftedBudget() {
    this.router.get("/budget/drafted", ExpenseController.handleDraftedBudget);
  }

  // expense
  createExpense() {
    this.router.post("/", ExpenseController.handleCreateExpense);
  }
  getExpense() {
    this.router.get("/:id", ExpenseController.handleGetExpense);
  }
  getAllExpense() {
    this.router.get("/all", ExpenseController.handleGetAllExpense);
  }
  updateExpense() {
    this.router.patch("/:id", ExpenseController.handleUpdateExpense);
  }
  deleteExpense() {
    this.router.delete("/:id", ExpenseController.handleDeleteExpense);
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
      "/:priority",
      ExpenseController.handleGetExpenseBasedonPriority,
    );
  }
  // payments
  createPayment() {
    this.router.post("/payment", ExpenseController.handleCreatePayment);
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
