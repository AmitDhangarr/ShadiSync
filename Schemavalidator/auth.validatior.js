import validator from "validator";

export const UserAuthenticationSchemaValidator = (data) => {
  const errors = {};
  const sanitizedData = {};
  const { email, password } = data || {};


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

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData,
  };
};