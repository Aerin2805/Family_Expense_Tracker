import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../controllers/TransactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories.js';

const router = express.Router();

router.use(authMiddleware);

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

function categoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

const transactionBodyValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['expense', 'income'])
    .withMessage('Type must be expense or income'),
  // Custom validator instead of a fixed isIn() list, because the valid
  // category set depends on whether this entry is an expense or income.
  body('category').custom((value, { req }) => {
    const allowed = categoriesForType(req.body.type);
    if (!allowed.includes(value)) {
      throw new Error(`Category must be one of: ${allowed.join(', ')}`);
    }
    return true;
  }),
  body('paymentType')
    .isIn(['cash', 'online'])
    .withMessage('Payment type must be cash or online'),
  body('note').optional().isString().trim(),
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid transaction id'),
];

// const listQueryValidation = [
//   query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
//   query('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
//   query('type')
//     .optional()
//     .isIn(['expense', 'income'])
//     .withMessage('type must be expense or income'),
//   // Filtering is read-only, so validating against the combined list (rather
//   // than cross-checking against a `type` query param) keeps this simple.
//   query('category').optional().isIn(ALL_CATEGORIES).withMessage('Invalid category'),
//   query('paymentType')
//     .optional()
//     .isIn(['cash', 'online'])
//     .withMessage('paymentType must be cash or online'),
// ];

router.post('/', validate(transactionBodyValidation), createTransaction);
// router.get('/', validate(listQueryValidation), listTransactions);
router.get('/:id', validate(idValidation), getTransactions);
router.put('/:id', validate([...idValidation, ...transactionBodyValidation]), updateTransaction);
router.delete('/:id', validate(idValidation), deleteTransaction);

export default router;