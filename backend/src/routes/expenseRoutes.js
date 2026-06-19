import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense,
} from '../controllers/expenseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { CATEGORIES } from '../constants/categories.js';

const router = express.Router();

router.use(authMiddleware);

const expenseBodyValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
  body('paymentType')
    .isIn(['cash', 'online'])
    .withMessage('Payment type must be cash or online'),
  body('note').optional().isString().trim(),
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid expense id'),
];

const listQueryValidation = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  query('category').optional().isIn(CATEGORIES).withMessage('Invalid category'),
  query('paymentType')
    .optional()
    .isIn(['cash', 'online'])
    .withMessage('paymentType must be cash or online'),
];

router.post('/', validate(expenseBodyValidation), createExpense);
router.get('/', validate(listQueryValidation), listExpenses);
router.get('/:id', validate(idValidation), getExpense);
router.put('/:id', validate([...idValidation, ...expenseBodyValidation]), updateExpense);
router.delete('/:id', validate(idValidation), deleteExpense);

export default router;
