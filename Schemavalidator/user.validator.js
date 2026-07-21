import validator from "validator";

export const userSchemaValidator = (data) => {
  const allowedRoles = ["host", "co-host", "guest"];
  const errors = {};
  const sanitizedData = {};
  const { name, email, password, phone, role ,securityQuestion,securityAnswer} = data || {};

  // validator for name
  if (!name || validator.isEmpty(name.trim())) {
    errors.name = "Name is required";
  } else if (!validator.isLength(name.trim(), { min: 3, max: 34 })) {
    errors.name = "Name must be between 3 and 34 characters";
  } else if (!validator.isAlpha(name.replace(/\s/g, ""))) {
    errors.name = "Name should be in letters";
  } else {
    sanitizedData.name = name.trim();
  }

  // validator for email
  if (!email || validator.isEmpty(email.trim())) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email.trim())) {
    errors.email = "Please provide a valid email address";
  } else {
    sanitizedData.email = email.trim();
  }

  // validator for password
  if (!password || validator.isEmpty(password.trim())) {
    errors.password = "Password is required";
  } else if (!validator.isLength(password.trim(), { min: 6, max: 18 })) {
    errors.password = "Password must be between 6 and 18 characters";
  } else if (!validator.isAlphanumeric(password.trim())) {
    errors.password = "Password must contain only letters and numbers";
  } else {
    sanitizedData.password = password.trim();
  }

  // validator for phone
  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (!validator.isNumeric(phone.toString())) {
    errors.phone = "Phone number should be numeric";
  } else if (!validator.isLength(phone.toString(), { min: 10, max: 10 })) {
    errors.phone = "Phone number should be of 10 numbers";
  } else {
    sanitizedData.phone = phone;
  }

  // validator for role
  if (!role || validator.isEmpty(role.trim())) {
  errors.role = "Role is required";
} else if (!allowedRoles.includes(role.trim())) {
  errors.role = `Role must be one of: ${allowedRoles.join(", ")}`;
} else {
  sanitizedData.role = role.trim();
}

  // validator for securityQuestion
  if (!securityQuestion) {
    errors.securityQuestion = "Security question is required";
  } else if (!validator.isLength(securityQuestion, { min: 10, max: 200 })) {
    errors.securityQuestion = "Security question should be 10-200 characters";
  } else {
    sanitizedData.securityQuestion = validator.escape(securityQuestion); // optional escaping
  }

  // validator for securityAnswer
  if (!securityAnswer) {
    errors.securityAnswer = "Security answer is required";
  } else if (!validator.isLength(securityAnswer, { min: 3, max: 100 })) {
    errors.securityAnswer = "Security answer should be 3-100 characters";
  } else {
    sanitizedData.securityAnswer = validator.escape(securityAnswer);
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};
