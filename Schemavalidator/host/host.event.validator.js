import validator from "validator";

const eventSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    event,
    eventDate,
    eventTime,
    eventVenue,
    status,
    guests,
    foodItems,
    vendors,
    photography,
    decoration,
    budget,
    expense,
  } = data;

  if (!event || validator.isEmpty(event.toString().trim())) {
    errors.event = "Event name is required";
  } else if (!validator.isLength(event.toString().trim(), { min: 3, max: 50 })) {
    errors.event = "Event name must be 3-50 characters";
  } else {
    sanitizedData.event = validator.escape(event.toString().trim());
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required";
  } else if (!validator.isISO8601(eventDate.toString())) {
    errors.eventDate = "Invalid event date format";
  } else {
    sanitizedData.eventDate = new Date(eventDate);
  }

  if (!eventTime || validator.isEmpty(eventTime.toString().trim())) {
    errors.eventTime = "Event time is required";
  } else {
    sanitizedData.eventTime = validator.escape(eventTime.toString().trim());
  }

  if (!eventVenue || validator.isEmpty(eventVenue.toString().trim())) {
    errors.eventVenue = "Event venue is required";
  } else if (!validator.isLength(eventVenue.toString().trim(), { min: 3, max: 100 })) {
    errors.eventVenue = "Event venue must be 3-100 characters";
  } else {
    sanitizedData.eventVenue = validator.escape(eventVenue.toString().trim());
  }

  const allowedStatuses = ["upcoming", "ongoing", "completed", "cancelled"];

  if (!status || validator.isEmpty(status.toString().trim())) {
    errors.status = "Event status is required";
  } else if (!allowedStatuses.includes(status.toString().trim())) {
    errors.status = "Invalid event status";
  } else {
    sanitizedData.status = validator.escape(status.toString().trim());
  }

  if (!Array.isArray(guests) || guests.length === 0) {
    errors.guests = "At least one guest is required";
  } else {
    sanitizedData.guests = guests.map((g, i) => {
      if (!g.name || validator.isEmpty(g.name.toString().trim())) {
        errors[`guests[${i}].name`] = "Guest name is required";
      }
      if (!g.phone || !validator.isNumeric(g.phone.toString())) {
        errors[`guests[${i}].phone`] = "Guest phone must be numeric";
      }
      return {
        name: validator.escape(g.name?.toString().trim() || ""),
        phone: g.phone?.toString().trim(),
      };
    });
  }

  if (!Array.isArray(foodItems) || foodItems.length === 0) {
    errors.foodItems = "At least one food item is required";
  } else {
    sanitizedData.foodItems = foodItems.map((item, i) => {
      if (!item || typeof item !== "object") {
        errors[`foodItems[${i}]`] = "Invalid food item";
        return { name: "", category: "main" };
      }
      if (!item.name || validator.isEmpty(item.name.toString().trim())) {
        errors[`foodItems[${i}].name`] = "Food item name is required";
      }

      let category = "main";
      if (item.category !== undefined && item.category !== null) {
        if (typeof item.category !== "string") {
          errors[`foodItems[${i}].category`] = "Category must be a string";
        } else {
          category = validator.escape(item.category.toString().trim());
        }
      }

      return {
        name: validator.escape(item.name?.toString().trim() || ""),
        category,
      };
    });
  }

  if (!Array.isArray(vendors) || vendors.length === 0) {
    errors.vendors = "At least one vendor is required";
  } else {
    sanitizedData.vendors = vendors.map((v, i) => {
      if (!v.name || validator.isEmpty(v.name.toString().trim())) {
        errors[`vendors[${i}].name`] = "Vendor name is required";
      }
      if (!v.service || validator.isEmpty(v.service.toString().trim())) {
        errors[`vendors[${i}].service`] = "Vendor service is required";
      }
      if (!v.contact) {
        errors[`vendors[${i}].contact`] = "Vendor contact is required";
      }
      if (!v.address) {
        errors[`vendors[${i}].address`] = "Vendor address is required";
      }
      if (!v.eventName) {
        errors[`vendors[${i}].eventName`] = "Vendor event name is required";
      }
      if (v.totalAmount === undefined || v.totalAmount === null) {
        errors[`vendors[${i}].totalAmount`] = "Vendor total amount is required";
      }
      if (!Array.isArray(v.payments) || v.payments.length === 0) {
        errors[`vendors[${i}].payments`] = "At least one payment is required per vendor";
      }

      const payments = (v.payments || []).map((p, j) => {
        const allowedTypes = [
          "advance",
          "partial",
          "settlement",
          "refund",
          "extra_charge",
          "discount",
        ];

        if (p.amount === undefined || p.amount === null) {
          errors[`vendors[${i}].payments[${j}].amount`] = "Payment amount is required";
        }
        if (!allowedTypes.includes(p.paymentType)) {
          errors[`vendors[${i}].payments[${j}].paymentType`] = "Invalid payment type";
        }
        if (!p.note || validator.isEmpty(p.note.toString().trim())) {
          errors[`vendors[${i}].payments[${j}].note`] = "Payment note is required";
        }

        return {
          amount: Number(p.amount),
          paymentType: p.paymentType,
          paymentDate: p.paymentDate ? new Date(p.paymentDate) : new Date(),
          note: validator.escape(p.note?.toString().trim() || ""),
        };
      });

      return {
        name: validator.escape(v.name?.toString().trim() || ""),
        service: validator.escape(v.service?.toString().trim() || ""),
        contact: v.contact?.toString().trim(),
        address: validator.escape(v.address?.toString().trim() || ""),
        eventName: validator.escape(v.eventName?.toString().trim() || ""),
        totalAmount: Number(v.totalAmount),
        payments,
      };
    });
  }

  if (typeof photography !== "boolean") {
    errors.photography = "Photography is required (true/false)";
  } else {
    sanitizedData.photography = photography;
  }

  if (typeof decoration !== "boolean") {
    errors.decoration = "Decoration is required (true/false)";
  } else {
    sanitizedData.decoration = decoration;
  }

  if (budget === undefined || budget === null) {
    errors.budget = "Budget is required";
  } else if (!validator.isNumeric(budget.toString())) {
    errors.budget = "Budget must be numeric";
  } else if (Number(budget) < 1000) {
    errors.budget = "Budget must be at least 1000";
  } else {
    sanitizedData.budget = Number(budget);
  }

  if (expense === undefined || expense === null) {
    errors.expense = "Expense is required";
  } else if (!validator.isNumeric(expense.toString())) {
    errors.expense = "Expense must be numeric";
  } else {
    sanitizedData.expense = Number(expense);
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default eventSchemaValidator;