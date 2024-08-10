// Import necessary modules
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Transaction from './models/Transaction.js'; // Importing the Transaction model

// Initialize the Express app
const app = express();

// Middleware Setup
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  methods: ['GET', 'POST', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));

app.use(express.json()); // Parse JSON bodies

// Database Connection
mongoose.connect('mongodb+srv://roychen651:Rr123456@cluster0.fewgi.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define Routes

// GET /transactions - Fetch all transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /transaction - Create a new transaction
app.post('/transaction', async (req, res) => {
  try {
    const { name, price, date, description } = req.body;
    const transaction = new Transaction({ name, price, date, description });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error in /transaction route:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

// DELETE /transaction/:id - Delete a transaction by ID
app.delete('/transaction/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (transaction) {
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
