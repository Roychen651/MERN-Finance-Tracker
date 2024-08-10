import mongoose, { model, Schema } from 'mongoose';

const TransactionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
});

const Transaction = model('Transaction', TransactionSchema);

export default Transaction;
