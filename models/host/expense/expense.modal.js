import mongoose from "mongoose";

const { Schema, model } = mongoose;

const expenseSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    budgetId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
    },

    expenseCode: {
      type: String,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    category: {
      type: String,
      required: true,
      trim: true,
    },

    subCategory: String,

    vendor: {
      vendorId: {
        type: Schema.Types.ObjectId,
        ref: "Vendor",
      },

      name: String,

      contactPerson: String,

      phone: String,

      email: String,

      gstNumber: String,
    },

    estimatedAmount: {
      type: Number,
      default: 0,
    },

    actualAmount: {
      type: Number,
      required: true,
    },

    taxAmount: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Approval",
        "Approved",
        "Booked",
        "Completed",
        "Cancelled",
      ],
      default: "Draft",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partial", "Paid", "Refunded"],
      default: "Unpaid",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    expenseDate: {
      type: Date,
      required: true,
    },

    bookingDate: Date,

    dueDate: Date,

    serviceDate: Date,

    attachments: [
      {
        type: {
          type: String,
          enum: ["Invoice", "Receipt", "Quotation", "Contract", "Other"],
        },

        fileUrl: String,

        fileName: String,
      },
    ],

    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvalDate: Date,

    remarks: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

expenseSchema.index({ eventId: 1 });
expenseSchema.index({ budgetId: 1 });
expenseSchema.index({ paymentStatus: 1 });

const EXPENSE = model("Expense", expenseSchema);
export default EXPENSE;
