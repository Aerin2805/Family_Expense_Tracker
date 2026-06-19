import Expense from '../models/Expense.js';
import { buildDateRangeQuery } from '../utils/expenseHelpers.js';
import { generateExpenseReportPdf, getPdfFilename } from '../services/pdfService.js';

async function getExpensesForReport(userId, startDate, endDate) {
  const { filter } = buildDateRangeQuery(startDate, endDate);

  const expenses = await Expense.find({
    userId,
    ...filter,
  }).sort({ date: 1, createdAt: 1 });

  return expenses;
}

async function buildSummary(userId, startDate, endDate) {
  const { start, end, filter } = buildDateRangeQuery(startDate, endDate);

  const [totals, categoryBreakdown, transactionCount] = await Promise.all([
    Expense.aggregate([
      { $match: { userId, ...filter } },
      {
        $group: {
          _id: '$paymentType',
          total: { $sum: '$amount' },
        },
      },
    ]),
    Expense.aggregate([
      { $match: { userId, ...filter } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Expense.countDocuments({ userId, ...filter }),
  ]);

  const totalCash = totals.find((t) => t._id === 'cash')?.total || 0;
  const totalOnline = totals.find((t) => t._id === 'online')?.total || 0;

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    totalCash,
    totalOnline,
    totalOverall: totalCash + totalOnline,
    categoryBreakdown: categoryBreakdown.map((item) => ({
      category: item._id,
      total: item.total,
    })),
    transactionCount,
  };
}

export async function getSummary(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const summary = await buildSummary(req.user._id, startDate, endDate);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

export async function downloadPdf(req, res, next) {
  try {
    const { startDate, endDate } = req.query;
    const summary = await buildSummary(req.user._id, startDate, endDate);
    const expenses = await getExpensesForReport(req.user._id, startDate, endDate);

    const filename = getPdfFilename(summary.startDate, summary.endDate);
    const doc = generateExpenseReportPdf(summary, expenses);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    doc.pipe(res);
  } catch (err) {
    next(err);
  }
}
