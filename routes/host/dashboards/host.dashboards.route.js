import { Router } from "express";
import Dashboards from "../../../controllers/host/dashboards/event.dashboard.controller.js";
class DashboardsRoute {
  router = null;

  constructor() {
    this.router = Router();
    this.getEventDashboard();
    this.getInvitationDashboard();
    this.getExpenseDashboard();
    this.getGiftDashboard();
  }

  getEventDashboard() {
    this.router.get("/event", Dashboards.handleEventDashboard);
  }
  getInvitationDashboard() {
    this.router.get("/invitation", Dashboards.handleInvitationDashboard);
  }
  getExpenseDashboard() {
    this.router.get("/expense", Dashboards.handleFinancialDashboard);
  }
  getGiftDashboard() {
    this.router.get("/gift", Dashboards.handleGiftDashboard);
  }
}

export default new DashboardsRoute().router;
