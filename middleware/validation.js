const { body, query, param } = require("express-validator");

const productValidator = {
  create: [
    body("name")
      .exists()
      .withMessage("Name was not provided")
      .bail()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 30 })
      .withMessage("Name cannot be more than 30 characters"),
    body("price")
      .exists()
      .withMessage("Price was not provided")
      .bail()
      .notEmpty()
      .withMessage("Price cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Price must be a number")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("author")
      .exists()
      .withMessage("Author was not provided")
      .bail()
      .notEmpty()
      .withMessage("Author cannot be empty")
      .bail()
      .isString()
      .withMessage("Author must be a string")
      .isLength({ max: 30 })
      .withMessage("Author cannot be more than 30 characters"),
    body("stock")
      .exists()
      .withMessage("Stock was not provided")
      .bail()
      .notEmpty()
      .withMessage("Stock cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Stock must be a number")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Stock must be a positive number"),
  ],
  update: [
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .bail()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ max: 30 })
      .withMessage("Name cannot be more than 30 characters"),
    body("price")
      .optional()
      .notEmpty()
      .withMessage("Price cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Price must be a number")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("author")

      .optional()
      .notEmpty()
      .withMessage("Author cannot be empty")
      .bail()
      .isString()
      .withMessage("Author must be a string")
      .isLength({ max: 30 })
      .withMessage("Author cannot be more than 30 characters"),
    body("stock")
      .optional()
      .notEmpty()
      .withMessage("Stock cannot be empty")
      .bail()
      .isNumeric()
      .withMessage("Stock must be a number")
      .bail()
      .isInt({ min: 0 })
      .withMessage("Stock must be a positive number"),
  ]
};

const authvalidator = {
  signUp: [
    body("name")
    .exists()
    .withMessage("Name was not provided")
    .bail()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 30 })
    .withMessage("Name cannot be more than 30 characters"),
  body("email.id")
    .exists()
    .withMessage("Email was not provided")
    .bail()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isString()
    .withMessage("Email must be a string")
    .bail()
    .isEmail()
    .withMessage("Email must be a valid email"),
  body("email.status")
    .not()
    .exists()
    .withMessage("Email status can not be provided"),
  body("address")
    .exists()
    .withMessage("Address was not provided")
    .bail()
    .notEmpty()
    .withMessage("Address cannot be empty")
    .bail()
    .isString()
    .withMessage("Address must be a string")
    .isLength({ max: 30 })
    .withMessage("Address cannot be more than 30 characters"),
  body("password")
    .exists()
    .withMessage("Password was not provided")
    .bail()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter,one number and one special character"),
  body("cpassword")
    .exists()
    .withMessage("Confirm Password was not provided")
    .bail()
    .notEmpty()
    .withMessage("Confirm Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Confirm Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Confirm Password must be at least 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    })
  ],
  login: [
    body("email")
    .exists()
    .withMessage("Invalid Credential")
    .bail()
    .notEmpty()
    .withMessage("Invalid Credential")
    .bail()
    .isString()
    .withMessage("Invalid Credential")
    .bail()
    .isEmail()
    .withMessage("Invalid Credential"),
  body("password")
    .exists()
    .withMessage("Invalid Credential")
    .bail()
    .notEmpty()
    .withMessage("Invalid Credential")
    .bail()
    .isString()
    .withMessage("Invalid Credential")
  ]
} 


module.exports = { productValidator,authvalidator};
