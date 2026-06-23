import EVENT from "../../../models/host/event/event.modal.js";
import BUDGET from "../../../models/host/expense/buget.modal.js";
import EXPENSE from "../../../models/host/expense/expense.modal.js";
import PAYMENTS from "../../../models/host/expense/payments.modal.js";
import GIFT from "../../../models/host/gift/gifts.modal.js";
import INVITATION from "../../../models/host/Invitation/invitation.modal.js";
import mongoose
 from "mongoose";
class Dashboards {
  static async #getEventId(userId) {
    const event = await EVENT.findOne(
      { userId: new mongoose.Types.ObjectId(userId) },
      { _id: 1 }
    ).lean();
    if (!event) throw new Error("No event found for this user");
    return event._id;
  }

  static async handleEventDashboard(req, res) {
    try {
      const userId = req.user.payload._id;
      const eventObjectId = await Dashboards.#getEventId(userId);
      const data = await Dashboards.getEventDashboard(eventObjectId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async handleFinancialDashboard(req, res) {
    try {
      const userId = req.user.payload._id;
      const eventObjectId = await Dashboards.#getEventId(userId);
      const data = await Dashboards.getFinancialDashboard(eventObjectId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async handleInvitationDashboard(req, res) {
    try {
      const userId = req.user.payload._id;
      const eventObjectId = await Dashboards.#getEventId(userId);
      const data = await Dashboards.getInvitationDashboard(eventObjectId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async handleGiftDashboard(req, res) {
    try {
      const userId = req.user.payload._id;
      const eventObjectId = await Dashboards.#getEventId(userId);
      const data = await Dashboards.getGiftDashboard(eventObjectId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getEventDashboard(eventObjectId) {
    const [eventStats, foodCategoryCount, photographyInfo, decorationInfo] =
      await Promise.all([
        EVENT.aggregate([
          { $match: { _id: eventObjectId } },
          {
            $project: {
              event: 1,
              eventDate: 1,
              eventTime: 1,
              eventVenue: 1,
              status: 1,
              budget: 1,
              budgetSummary: 1,
              expenseSummary: 1,
              totalGuests: { $size: "$guests" },
              totalFoodItems: { $size: "$foodItems" },
              photography: 1,
              decoration: 1,
              daysUntilEvent: {
                $ceil: {
                  $divide: [
                    { $subtract: ["$eventDate", new Date()] },
                    1000 * 60 * 60 * 24,
                  ],
                },
              },
              budgetUtilisationPct: {
                $cond: [
                  { $gt: ["$budget", 0] },
                  {
                    $round: [
                      {
                        $multiply: [
                          { $divide: ["$budgetSummary.totalConsumed", "$budget"] },
                          100,
                        ],
                      },
                      1,
                    ],
                  },
                  0,
                ],
              },
            },
          },
        ]),
        EVENT.aggregate([
          { $match: { _id: eventObjectId } },
          { $unwind: { path: "$foodItems", preserveNullAndEmptyArrays: true } },
          { $group: { _id: "$foodItems.category", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        EVENT.findOne({ _id: eventObjectId }, { photography: 1 }).lean(),
        EVENT.findOne({ _id: eventObjectId }, { decoration: 1 }).lean(),
      ]);

    const core = eventStats[0] || {};

    return {
      id: core._id,
      eventId: core.eventId,
      name: core.event,
      date: core.eventDate,
      time: core.eventTime,
      venue: core.eventVenue,
      status: core.status,
      daysUntilEvent: core.daysUntilEvent,
      guests: { total: core.totalGuests || 0 },
      foodItems: {
        total: core.totalFoodItems || 0,
        byCategory: foodCategoryCount.map((f) => ({
          category: f._id || "uncategorised",
          count: f.count,
        })),
      },
      photography: {
        included: photographyInfo?.photography?.included || false,
        vendorName: photographyInfo?.photography?.vendorName || null,
        totalAmount: photographyInfo?.photography?.totalAmount || 0,
        paymentStatus: photographyInfo?.photography?.paymentStatus || null,
      },
      decoration: {
        included: decorationInfo?.decoration?.included || false,
        vendorName: decorationInfo?.decoration?.vendorName || null,
        totalAmount: decorationInfo?.decoration?.totalAmount || 0,
        paymentStatus: decorationInfo?.decoration?.paymentStatus || null,
      },
      budget: {
        total: core.budget || 0,
        utilisationPct: core.budgetUtilisationPct || 0,
        summary: core.budgetSummary || {},
      },
      expenseSummary: core.expenseSummary || {},
    };
  }

  static async getFinancialDashboard(eventObjectId) {
    const [
      budgetSummary, budgetByCategory, budgetByType, budgetByStatus, topBudgets,
      expenseSummary, expenseByCategory, expenseByPaymentStatus, expenseByStatus,
      expenseByPriority, recentExpenses, overBudgetItems, expenseMonthlyTrend,
      paymentSummary, paymentByMethod, paymentByType, paymentByStatus,
      recentPayments, paymentDailyTrend,
    ] = await Promise.all([
      BUDGET.aggregate([
        { $match: { eventId: eventObjectId } },
        {
          $group: {
            _id: null,
            totalAllocated: { $sum: "$allocatedAmount" },
            totalRevised: { $sum: "$revisedAmount" },
            totalConsumed: { $sum: "$consumedAmount" },
            totalRemaining: { $sum: "$remainingAmount" },
            count: { $sum: 1 },
            lockedCount: { $sum: { $cond: ["$isLocked", 1, 0] } },
          },
        },
      ]),
      BUDGET.aggregate([
        { $match: { eventId: eventObjectId } },
        {
          $group: {
            _id: "$category",
            allocated: { $sum: "$allocatedAmount" },
            consumed: { $sum: "$consumedAmount" },
            remaining: { $sum: "$remainingAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { allocated: -1 } },
      ]),
      BUDGET.aggregate([
        { $match: { eventId: eventObjectId } },
        {
          $group: {
            _id: "$budgetType",
            totalAllocated: { $sum: "$allocatedAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { totalAllocated: -1 } },
      ]),
      BUDGET.aggregate([
        { $match: { eventId: eventObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 }, totalAllocated: { $sum: "$allocatedAmount" } } },
      ]),
      BUDGET.find({ eventId: eventObjectId })
        .sort({ allocatedAmount: -1 })
        .limit(5)
        .select("title category allocatedAmount consumedAmount remainingAmount status budgetType")
        .lean(),
      EXPENSE.aggregate([
        { $match: { eventId: eventObjectId, isDeleted: false } },
        {
          $group: {
            _id: null,
            totalEstimated: { $sum: "$estimatedAmount" },
            totalActual: { $sum: "$actualAmount" },
            totalPaid: { $sum: "$paidAmount" },
            totalRemaining: { $sum: "$remainingAmount" },
            totalTax: { $sum: "$taxAmount" },
            totalDiscount: { $sum: "$discountAmount" },
            totalAmount: { $sum: "$totalAmount" },
            count: { $sum: 1 },
          },
        },
      ]),
      EXPENSE.aggregate([
        { $match: { eventId: eventObjectId, isDeleted: false } },
        {
          $group: {
            _id: "$category",
            estimated: { $sum: "$estimatedAmount" },
            actual: { $sum: "$actualAmount" },
            paid: { $sum: "$paidAmount" },
            remaining: { $sum: "$remainingAmount" },
            count: { $sum: 1 },
          },
        },
        {
          $addFields: {
            variancePct: {
              $cond: [
                { $gt: ["$estimated", 0] },
                {
                  $round: [
                    { $multiply: [{ $divide: [{ $subtract: ["$actual", "$estimated"] }, "$estimated"] }, 100] },
                    1,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { actual: -1 } },
      ]),
      EXPENSE.aggregate([
        { $match: { eventId: eventObjectId, isDeleted: false } },
        { $group: { _id: "$paymentStatus", count: { $sum: 1 }, totalAmount: { $sum: "$totalAmount" } } },
      ]),
      EXPENSE.aggregate([
        { $match: { eventId: eventObjectId, isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$totalAmount" } } },
      ]),
      EXPENSE.aggregate([
        { $match: { eventId: eventObjectId, isDeleted: false } },
        { $group: { _id: "$priority", count: { $sum: 1 }, totalAmount: { $sum: "$totalAmount" } } },
      ]),
      EXPENSE.find({ eventId: eventObjectId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title category actualAmount totalAmount paymentStatus status priority expenseDate vendor.name")
        .lean(),
      EXPENSE.aggregate([
        {
          $match: {
            eventId: eventObjectId,
            isDeleted: false,
            $expr: { $gt: ["$actualAmount", "$estimatedAmount"] },
          },
        },
        {
          $project: {
            title: 1, category: 1, estimatedAmount: 1, actualAmount: 1,
            overBy: { $subtract: ["$actualAmount", "$estimatedAmount"] },
          },
        },
        { $sort: { overBy: -1 } },
        { $limit: 5 },
      ]),
      EXPENSE.aggregate([
        {
          $match: {
            eventId: eventObjectId,
            isDeleted: false,
            expenseDate: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) },
          },
        },
        {
          $group: {
            _id: { year: { $year: "$expenseDate" }, month: { $month: "$expenseDate" } },
            totalActual: { $sum: "$actualAmount" },
            totalPaid: { $sum: "$paidAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      PAYMENTS.aggregate([
        { $match: { eventId: eventObjectId } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
            completedAmount: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$amount", 0] } },
            pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0] } },
            failedAmount: { $sum: { $cond: [{ $eq: ["$status", "Failed"] }, "$amount", 0] } },
          },
        },
      ]),
      PAYMENTS.aggregate([
        { $match: { eventId: eventObjectId } },
        { $group: { _id: "$paymentMethod", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
        { $sort: { totalAmount: -1 } },
      ]),
      PAYMENTS.aggregate([
        { $match: { eventId: eventObjectId } },
        { $group: { _id: "$paymentType", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
      ]),
      PAYMENTS.aggregate([
        { $match: { eventId: eventObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 }, totalAmount: { $sum: "$amount" } } },
      ]),
      PAYMENTS.find({ eventId: eventObjectId })
        .sort({ paymentDate: -1 })
        .limit(5)
        .select("amount paymentType paymentMethod status paymentDate transactionReference notes")
        .lean(),
      PAYMENTS.aggregate([
        {
          $match: {
            eventId: eventObjectId,
            paymentDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          },
        },
        {
          $group: {
            _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" }, day: { $dayOfMonth: "$paymentDate" } },
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]),
    ]);

    return {
      budget: { summary: budgetSummary[0] || {}, byCategory: budgetByCategory, byType: budgetByType, byStatus: budgetByStatus, topBudgets },
      expense: { summary: expenseSummary[0] || {}, byCategory: expenseByCategory, byPaymentStatus: expenseByPaymentStatus, byStatus: expenseByStatus, byPriority: expenseByPriority, recentExpenses, overBudgetItems, monthlyTrend: expenseMonthlyTrend },
      payment: { summary: paymentSummary[0] || {}, byMethod: paymentByMethod, byType: paymentByType, byStatus: paymentByStatus, recentPayments, dailyTrend: paymentDailyTrend },
    };
  }

  static async getInvitationDashboard(eventObjectId) {
    const [summary, byStatus, byAcceptance, byCategory, chiefGuestStats, recentInvitations] =
      await Promise.all([
        INVITATION.aggregate([
          { $match: { eventId: eventObjectId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              totalInvited: { $sum: { $cond: [{ $eq: ["$status", "invited"] }, 1, 0] } },
              totalYetToInvite: { $sum: { $cond: [{ $eq: ["$status", "yet to invite"] }, 1, 0] } },
              totalAccepted: { $sum: { $cond: [{ $eq: ["$acceptance", "accepted"] }, 1, 0] } },
              totalNotAccepted: { $sum: { $cond: [{ $eq: ["$acceptance", "not accepted"] }, 1, 0] } },
              totalPending: { $sum: { $cond: [{ $eq: ["$acceptance", "pending"] }, 1, 0] } },
              totalChiefGuests: { $sum: { $cond: ["$chiefGuest", 1, 0] } },
            },
          },
        ]),
        INVITATION.aggregate([
          { $match: { eventId: eventObjectId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        INVITATION.aggregate([
          { $match: { eventId: eventObjectId } },
          { $group: { _id: "$acceptance", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        INVITATION.aggregate([
          { $match: { eventId: eventObjectId } },
          {
            $group: {
              _id: "$category",
              total: { $sum: 1 },
              invited: { $sum: { $cond: [{ $eq: ["$status", "invited"] }, 1, 0] } },
              accepted: { $sum: { $cond: [{ $eq: ["$acceptance", "accepted"] }, 1, 0] } },
            },
          },
          { $sort: { total: -1 } },
        ]),
        INVITATION.aggregate([
          { $match: { eventId: eventObjectId, chiefGuest: true } },
          { $group: { _id: "$acceptance", count: { $sum: 1 } } },
        ]),
        INVITATION.find({ eventId: eventObjectId })
          .sort({ createdAt: -1 })
          .limit(5)
          .select("firstName lastName category status acceptance chiefGuest createdAt")
          .lean(),
      ]);

    return { summary: summary[0] || {}, byStatus, byAcceptance, byCategory, chiefGuestStats, recentInvitations };
  }

  static async getGiftDashboard(eventObjectId) {
    const [summary, byType, byFunction, byPaymentMode, topCashGivers] =
      await Promise.all([
        GIFT.aggregate([
          { $match: { event_id: eventObjectId } },
          {
            $group: {
              _id: null,
              totalGifts: { $sum: 1 },
              totalCash: { $sum: "$shagun_amount" },
              thankYouSent: { $sum: { $cond: ["$thank_you_sent", 1, 0] } },
              returnGiftGiven: { $sum: { $cond: ["$return_gift_given", 1, 0] } },
            },
          },
        ]),
        GIFT.aggregate([
          { $match: { event_id: eventObjectId } },
          { $group: { _id: "$gift_type", count: { $sum: 1 }, totalValue: { $sum: "$shagun_amount" } } },
        ]),
        GIFT.aggregate([
          { $match: { event_id: eventObjectId } },
          { $group: { _id: "$function_name", count: { $sum: 1 }, totalCash: { $sum: "$shagun_amount" } } },
          { $sort: { totalCash: -1 } },
        ]),
        GIFT.aggregate([
          { $match: { event_id: eventObjectId } },
          { $group: { _id: "$payment_mode", count: { $sum: 1 }, totalAmount: { $sum: "$shagun_amount" } } },
          { $sort: { totalAmount: -1 } },
        ]),
        GIFT.find({ event_id: eventObjectId, gift_type: "Cash" })
          .sort({ shagun_amount: -1 })
          .limit(5)
          .select("guest_name guest_family shagun_amount payment_mode function_name")
          .lean(),
      ]);

    return { summary: summary[0] || {}, byType, byFunction, byPaymentMode, topCashGivers };
  }
}

export default Dashboards;