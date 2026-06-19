import { endOfDay, parseDateParam, startOfDay } from '../utils/dateHelpers.js';

export function buildDateRangeQuery(startDate, endDate) {
  const start = startOfDay(parseDateParam(startDate, 'startDate'));
  const end = endOfDay(parseDateParam(endDate, 'endDate'));

  if (start > end) {
    const err = new Error('startDate must be before or equal to endDate');
    err.status = 400;
    throw err;
  }

  return {
    start,
    end,
    filter: {
      date: { $gte: start, $lte: end },
    },
  };
}

export function formatExpense(expense) {
  return {
    id: expense._id,
    date: expense.date,
    amount: expense.amount,
    category: expense.category,
    paymentType: expense.paymentType,
    note: expense.note,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt,
  };
}
