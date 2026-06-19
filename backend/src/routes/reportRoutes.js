import express from 'express';
import { query } from 'express-validator';
import { downloadPdf, getSummary } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(authMiddleware);

const dateRangeValidation = [
  query('startDate').isISO8601().withMessage('startDate is required and must be valid'),
  query('endDate').isISO8601().withMessage('endDate is required and must be valid'),
];

router.get('/summary', validate(dateRangeValidation), getSummary);
router.get('/pdf', validate(dateRangeValidation), downloadPdf);

export default router;
