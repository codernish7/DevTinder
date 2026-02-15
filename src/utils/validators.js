const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, gender, email, password, age } = req.body;
  if (!firstName || firstName.length < 3 || firstName.length > 50) {
    throw new Error("name must have atleast 3 characters");
  } else if (!gender || !["male", "female", "others"].includes(gender.toLowerCase())) {
    throw new Error("enter a valid gender");
  } else if (!email || !validator.isEmail(email.toLowerCase())) {
    throw new Error("enter valid email");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("enter a strong password");
  } else if (!age || age < 18) {
    throw new Error("minimum age must be 18");
  }
};

module.exports = validateSignUp;
