import mongoose from 'mongoose';
import { CATEGORIES } from '../constants/categories.js';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ['cash', 'online'],
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

expenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Expense', expenseSchema);
