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
    photography,
    decoration,
    budget,
  } = data || {};

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
      if (!g || typeof g !== "object") {
        errors[`guests[${i}]`] = "Invalid guest entry";
        return { name: "", phone: "" };
      }

      if (!g.name || validator.isEmpty(g.name.toString().trim())) {
        errors[`guests[${i}].name`] = "Guest name is required";
      }

      let phone = "";
      if (!g.phone || validator.isEmpty(g.phone.toString().trim())) {
        errors[`guests[${i}].phone`] = "Guest phone is required";
      } else {
        const rawPhone = g.phone.toString().trim();
        // Accepts optional leading + and digits, e.g. +919876543210 or 9876543210
        if (!validator.isMobilePhone(rawPhone, "any", { strictMode: false })) {
          errors[`guests[${i}].phone`] = "Guest phone must be a valid phone number";
        } else {
          phone = rawPhone;
        }
      }

      return {
        name:  validator.escape(g.name?.toString().trim() || ""),
        phone,
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

  if (typeof photography !== "boolean") {
    errors.photography = "Photography selection is required (true/false)";
  } else {
    sanitizedData.photography = {
      included:      photography,
      vendorName:    null,
      totalAmount:   0,
      paymentStatus: null,
    };
  }

  if (typeof decoration !== "boolean") {
    errors.decoration = "Decoration selection is required (true/false)";
  } else {
    sanitizedData.decoration = {
      included:      decoration,
      vendorName:    null,
      totalAmount:   0,
      paymentStatus: null,
    };
  }

  if (budget === undefined || budget === null) {
    errors.budget = "Budget is required";
  } else if (!validator.isNumeric(budget.toString())) {
    errors.budget = "Budget must be numeric";
  } else if (Number(budget) < 1000) {
    errors.budget = "Budget must be at least 1000";
  } else {
    sanitizedData.budget = Number(budget);
    sanitizedData.budgetSummary = {
      totalAllocated: 0,
      totalConsumed:  0,
      totalRemaining: 0,
      isOverBudget:   false,
    };
    sanitizedData.expenseSummary = {
      totalEstimated: 0,
      totalActual:    0,
      totalPaid:      0,
      totalRemaining: 0,
      totalTax:       0,
      totalDiscount:  0,
    };
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};

export default eventSchemaValidator;