import validator from "validator";
 const eventSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};

  const {
    event,
    eventDate,
    eventVenue,
    guests,
    foodItems,
    photography,
    decoration,
    budget,
    expense,
    vendors,
  } = data;

  if (!event || validator.isEmpty(event.trim())) {
    errors.event = "Event name is required";
  } else if (!validator.isLength(event.trim(), { min: 3, max: 50 })) {
    errors.event = "Event name must be 3-50 characters";
  } else {
    sanitizedData.event = validator.escape(event.trim());
  }

  if (!eventDate) {
    errors.eventDate = "Event date is required";
  } else if (!validator.isISO8601(eventDate.toString())) {
    errors.eventDate = "Invalid date format";
  } else {
    sanitizedData.eventDate = new Date(eventDate);
  }

  if (!eventVenue || validator.isEmpty(eventVenue.trim())) {
    errors.eventVenue = "Event venue is required";
  } else if (!validator.isLength(eventVenue.trim(), { min: 3, max: 100 })) {
    errors.eventVenue = "Venue must be 3-100 characters";
  } else {
    sanitizedData.eventVenue = validator.escape(eventVenue.trim());
  }

  if (guests && Array.isArray(guests)) {
    sanitizedData.guests = guests.map((g, i) => {
      if (!g.name || validator.isEmpty(g.name.trim())) {
        errors[`guests[${i}].name`] = "Guest name is required";
      }
      if (!g.phone || !validator.isNumeric(g.phone.toString())) {
        errors[`guests[${i}].phone`] = "Guest phone must be numeric";
      }

      return {
        name: validator.escape(g.name?.trim() || ""),
        phone: g.phone?.toString(),
      };
    });
  } else {
    sanitizedData.guests = [];
  }

  if (foodItems && Array.isArray(foodItems)) {
    sanitizedData.foodItems = foodItems.map((item, i) => {
      if (!item.name || validator.isEmpty(item.name.trim())) {
        errors[`foodItems[${i}].name`] = "Food item name required";
      }

      return {
        name: validator.escape(item.name?.trim() || ""),
        category: item.category ? validator.escape(item.category) : "main",
      };
    });
  } else {
    sanitizedData.foodItems = [];
  }

  if (vendors && Array.isArray(vendors)) {
    sanitizedData.vendors = vendors.map((v, i) => {
      if (!v.name) {
        errors[`vendors[${i}].name`] = "Vendor name required";
      }
      if (!v.service) {
        errors[`vendors[${i}].service`] = "Vendor service required";
      }

      return {
        name: validator.escape(v.name?.trim() || ""),
        service: validator.escape(v.service?.trim() || ""),
        contact: v.contact ? v.contact.toString() : "",
      };
    });
  } else {
    sanitizedData.vendors = [];
  }

  if (typeof photography !== "boolean") {
    errors.photography = "Photography must be true or false";
  } else {
    sanitizedData.photography = photography;
  }

  if (typeof decoration !== "boolean") {
    errors.decoration = "Decoration must be true or false";
  } else {
    sanitizedData.decoration = decoration;
  }

  if (!budget && budget !== 0) {
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