import Expense from '../models/Expense.js';
import { buildDateRangeQuery, formatExpense } from '../utils/expenseHelpers.js';
import { endOfDay, startOfDay } from '../utils/dateHelpers.js';

function buildListFilter(userId, query) {
  const filter = { userId };

  if (query.startDate && query.endDate) {
    const { filter: dateFilter } = buildDateRangeQuery(query.startDate, query.endDate);
    Object.assign(filter, dateFilter);
  } else if (query.startDate || query.endDate) {
    const err = new Error('Both startDate and endDate are required for date filtering');
    err.status = 400;
    throw err;
  } else {
    const now = new Date();
    filter.date = {
      $gte: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
      $lte: endOfDay(now),
    };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.paymentType) {
    filter.paymentType = query.paymentType;
  }

  return filter;
}

export async function createExpense(req, res, next) {
  try {
    const { date, amount, category, paymentType, note } = req.body;

    const expense = await Expense.create({
      userId: req.user._id,
      date: new Date(date),
      amount,
      category,
      paymentType,
      note: note || '',
    });

    res.status(201).json(formatExpense(expense));
  } catch (err) {
    next(err);
  }
}

export async function listExpenses(req, res, next) {
  try {
    const filter = buildListFilter(req.user._id, req.query);
    const expenses = await Expense.find(filter).sort({ date: -1, createdAt: -1 });

    res.json(expenses.map(formatExpense));
  } catch (err) {
    next(err);
  }
}

export async function getExpense(req, res, next) {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(formatExpense(expense));
  } catch (err) {
    next(err);
  }
}

export async function updateExpense(req, res, next) {
  try {
    const { date, amount, category, paymentType, note } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        date: new Date(date),
        amount,
        category,
        paymentType,
        note: note || '',
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(formatExpense(expense));
  } catch (err) {
    next(err);
  }
}

export async function deleteExpense(req, res, next) {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
}
