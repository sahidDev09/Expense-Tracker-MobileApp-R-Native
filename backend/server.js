const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("syndicate_salman");
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

connectDB();

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  console.log("GET /api/transactions");
  try {
    const transactions = await db.collection("transactions").find({}).sort({ timestamp: -1 }).toArray();
    res.json(transactions);
  } catch (err) {
    console.error("GET Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Add a transaction
app.post('/api/transactions', async (req, res) => {
  console.log("POST /api/transactions", req.body);
  try {
    const newTransaction = req.body;
    const result = await db.collection("transactions").insertOne(newTransaction);
    console.log("Insert success:", result.insertedId);
    res.status(201).json({ ...newTransaction, _id: result.insertedId });
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // We try to match by our custom 'id' or MongoDB '_id'
    const result = await db.collection("transactions").deleteOne({ 
      $or: [
        { id: id },
        { _id: ObjectId.isValid(id) ? new ObjectId(id) : null }
      ]
    });
    res.json({ message: "Deleted successfully", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
