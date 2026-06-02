const { validationResult } = require('express-validator');

/**
 * validate — Middleware to check express-validator results
 *
 * Usage in routes:
 *   router.post('/register', [
 *     body('email').isEmail(),
 *     body('password').isLength({ min: 6 }),
 *     body('name').notEmpty()
 *   ], validate, register)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = validate;
