import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
      default: 'expense',
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      // Always stored as a positive number — `type` carries the direction,
      // so there's no risk of sign-confusion bugs (e.g. a negative income).
      type: Number,
      required: true,
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    paymentType: {
      type: String,
      enum: ['cash', 'online'],
      required: true,
    },
    note: {
      type: String,
      maxlength: 200,
      default: '',
    },
  },
  { timestamps: true }
);
 
// Fast lookups for "everything this month" and "just my expenses this month"
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
 
// Third argument keeps the underlying MongoDB collection named "expenses"
// so you don't need a data migration if you already have expense documents
// saved from the old Expense model. Drop it if you'd rather start fresh
// with a "transactions" collection.
export default mongoose.model('Transaction', transactionSchema, 'transactions');
 
