import Transaction from '../models/Transaction.js';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories.js';

function categoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

function isValidCategory(type, category) {
  return categoriesForType(type).includes(category);
}

// GET /api/transactions/categories
// Lets the frontend ask "what categories should I show?" instead of
// hardcoding the list twice (once for the expense form, once for income).
export async function getCategories(req, res) {
  res.json({
    expense: EXPENSE_CATEGORIES,
    income: INCOME_CATEGORIES,
  });
}

// POST /api/transactions
export async function createTransaction(req, res) {
  try {
    const { date, amount, category, paymentType, note, type = 'expense' } = req.body;

    if (!['expense', 'income'].includes(type)) {
      return res.status(400).json({ message: 'Type must be "expense" or "income"' });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (!['cash', 'online'].includes(paymentType)) {
      return res.status(400).json({ message: 'Payment type must be "cash" or "online"' });
    }
    if (!category || !isValidCategory(type, category)) {
      return res.status(400).json({
        message: `"${category}" is not a valid category for ${type === 'income' ? 'an income' : 'an expense'} entry`,
      });
    }
    if (!date || isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'A valid date is required' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      date,
      amount,
      category,
      paymentType,
      note: note || '',
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Could not save this entry. Please try again.' });
  }
}

// GET /api/transactions
// Supports ?startDate=&endDate=&category=&paymentType=&type=
export async function getTransactions(req, res) {
  try {
    const { startDate, endDate, category, paymentType, type } = req.query;

    const filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (category) filter.category = category;
    if (paymentType) filter.paymentType = paymentType;
    if (type) filter.type = type;

    const transactions = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Could not load entries. Please try again.' });
  }
}

// GET /api/transactions/:id
export async function getTransactionById(req, res) {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Could not load this entry.' });
  }
}

// PUT /api/transactions/:id
export async function updateTransaction(req, res) {
  try {
    const { date, amount, category, paymentType, note, type } = req.body;

    const existing = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existing) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const nextType = type || existing.type;

    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    if (paymentType && !['cash', 'online'].includes(paymentType)) {
      return res.status(400).json({ message: 'Payment type must be "cash" or "online"' });
    }
    if (category && !isValidCategory(nextType, category)) {
      return res.status(400).json({
        message: `"${category}" is not a valid category for ${nextType === 'income' ? 'an income' : 'an expense'} entry`,
      });
    }
    if (date && isNaN(new Date(date).getTime())) {
      return res.status(400).json({ message: 'A valid date is required' });
    }

    existing.date = date ?? existing.date;
    existing.amount = amount ?? existing.amount;
    existing.category = category ?? existing.category;
    existing.paymentType = paymentType ?? existing.paymentType;
    existing.note = note ?? existing.note;
    existing.type = nextType;

    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(500).json({ message: 'Could not update this entry.' });
  }
}

// DELETE /api/transactions/:id
export async function deleteTransaction(req, res) {
  try {
    const deleted = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete this entry.' });
  }
}