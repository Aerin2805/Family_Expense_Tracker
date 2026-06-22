import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { generateTransactionPdf } from '../services/pdfService.js';

// Shared aggregation logic so the on-screen summary and the downloaded PDF
// can never report different numbers for the same date range.
async function buildSummary(userId, startDate, endDate) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const byTypeAndPayment = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { type: '$type', paymentType: '$paymentType' },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const totals = { cashSpent: 0, cashReceived: 0, onlineSpent: 0, onlineReceived: 0 };
  for (const row of byTypeAndPayment) {
    const { type, paymentType } = row._id;
    const key = `${paymentType}${type === 'income' ? 'Received' : 'Spent'}`; // e.g. "cashSpent"
    totals[key] = row.total;
  }

  const totalSpent = totals.cashSpent + totals.onlineSpent;
  const totalReceived = totals.cashReceived + totals.onlineReceived;
  const netBalance = totalReceived - totalSpent;

  const byCategory = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: { type: '$type', category: '$category' },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const expenseCategoryBreakdown = byCategory
    .filter((row) => row._id.type === 'expense')
    .map((row) => ({ category: row._id.category, total: row.total }));

  const incomeCategoryBreakdown = byCategory
    .filter((row) => row._id.type === 'income')
    .map((row) => ({ category: row._id.category, total: row.total }));

  const transactionCount = await Transaction.countDocuments(match);

  return {
    startDate,
    endDate,
    totalSpent,
    totalReceived,
    netBalance, // positive = surplus, negative = deficit
    cash: {
      spent: totals.cashSpent,
      received: totals.cashReceived,
      net: totals.cashReceived - totals.cashSpent,
    },
    online: {
      spent: totals.onlineSpent,
      received: totals.onlineReceived,
      net: totals.onlineReceived - totals.onlineSpent,
    },
    expenseCategoryBreakdown,
    incomeCategoryBreakdown,
    transactionCount,
  };
}

// GET /api/reports/summary?startDate=&endDate=
// Note: startDate/endDate are already validated as required ISO dates by
// dateRangeValidation in reportRoutes.js, so no need to re-check them here.
export async function getSummary(req, res) {
  try {
    const { startDate, endDate } = req.query;
    const summary = await buildSummary(req.user.id, startDate, endDate);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: 'Could not generate the report. Please try again.' });
  }
}

// GET /api/reports/pdf?startDate=&endDate=
export async function downloadPdf(req, res) {
  try {
    const { startDate, endDate } = req.query;

    const summary = await buildSummary(req.user.id, startDate, endDate);
    const transactions = await Transaction.find({
      userId: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    }).sort({ date: 1 });

    generateTransactionPdf({ startDate, endDate, summary, transactions }, res);
    // nothing else needed — the function above already sets headers,
    // pipes the PDF into res, and ends the response
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ message: 'Could not generate the PDF. Please try again.' });
  }
}