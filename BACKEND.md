# AI Finance Tracker - Complete Backend Setup

**Build the backend from scratch!** 🚀

---

## STEP 1️⃣: Create Backend Folder

In your terminal at `D:\Intern_Task`, run:

```bash
mkdir backend
cd backend
npm init -y
```

You should be at:
```
D:\Intern_Task\backend>
```

---

## STEP 2️⃣: Install Dependencies

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken axios
npm install -D nodemon
```

⏱️ Wait 2-3 minutes

---

## STEP 3️⃣: Create .env File

In `D:\Intern_Task\backend`, create a file named `.env`:

**Right-click → New → Text Document → Rename to `.env`**

Paste this content:

```env
MONGODB_URI=mongodb://localhost:27017/finance-tracker
JWT_SECRET=your_jwt_secret_key_12345
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
```

**IMPORTANT:** Get your OpenAI API key from: https://platform.openai.com/api-keys

---

## STEP 4️⃣: Create Folder Structure

```bash
mkdir config models routes middleware controllers
```

Result:
```
backend/
├── config/
├── models/
├── routes/
├── middleware/
├── controllers/
├── node_modules/
├── .env
├── package.json
└── server.js (will create next)
```

---

## STEP 5️⃣: Copy Backend Files

I'll provide you with ALL the backend files. Copy each one to the correct location.

---

## 📁 BACKEND FILES TO CREATE

### FILE 1: `backend/server.js`

Copy this entire content to `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const insightsRoutes = require('./routes/insights');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/insights', insightsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running ✅' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

### FILE 2: `backend/config/db.js`

Create file: `backend/config/db.js`

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### FILE 3: `backend/models/User.js`

Create file: `backend/models/User.js`

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

### FILE 4: `backend/models/Transaction.js`

Create file: `backend/models/Transaction.js`

```javascript
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Income', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Salary', 'Freelance', 'Investment', 'Bonus', 'Gift', 'Other'],
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
```

---

### FILE 5: `backend/middleware/auth.js`

Create file: `backend/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

---

### FILE 6: `backend/routes/auth.js`

Create file: `backend/routes/auth.js`

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

### FILE 7: `backend/routes/transactions.js`

Create file: `backend/routes/transactions.js`

```javascript
const express = require('express');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { description, amount, category, type, date } = req.body;

    const transaction = new Transaction({
      userId: req.userId,
      description,
      amount,
      category,
      type,
      date: date || Date.now(),
    });

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

### FILE 8: `backend/routes/insights.js`

Create file: `backend/routes/insights.js`

```javascript
const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get AI insights
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    // Calculate totals by category
    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    // If no transactions, return default response
    if (Object.keys(categoryTotals).length === 0) {
      return res.json({
        categoryTotals: {},
        insights: 'Add some transactions to get AI-powered financial insights!',
      });
    }

    // Create prompt for OpenAI
    const prompt = `Based on the following spending data, provide budget suggestions and financial insights in 3-4 bullet points:
${JSON.stringify(categoryTotals)}
Keep it brief and actionable.`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const insights = response.data.choices[0].message.content;

      res.json({
        categoryTotals,
        insights,
      });
    } catch (aiError) {
      // If OpenAI fails, return mock insights
      res.json({
        categoryTotals,
        insights: '💡 Financial Tips:\n• Review your spending categories\n• Set monthly budgets\n• Track expenses regularly\n• Look for areas to save',
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

### FILE 9: `backend/package.json`

Create/Update: `backend/package.json`

```json
{
  "name": "finance-tracker-backend",
  "version": "1.0.0",
  "description": "AI Personal Finance Tracker Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "axios": "^1.3.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## STEP 6️⃣: Setup MongoDB

You need MongoDB running locally. Download from: https://www.mongodb.com/try/download/community

Or use **MongoDB Atlas** (cloud):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
   ```

---

## STEP 7️⃣: Start Backend

```bash
cd D:\Intern_Task\backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

## ✅ BACKEND FILES CHECKLIST

```
backend/
├── config/
│   └── db.js ✓
├── models/
│   ├── User.js ✓
│   └── Transaction.js ✓
├── routes/
│   ├── auth.js ✓
│   ├── transactions.js ✓
│   └── insights.js ✓
├── middleware/
│   └── auth.js ✓
├── server.js ✓
├── .env ✓
├── package.json ✓
└── node_modules/ (after npm install)
```

---

## 🚀 ONCE BACKEND IS RUNNING

In another terminal, start frontend:

```bash
cd D:\Intern_Task\finance-tracker-frontend
npm start
```

---

## 🧪 TEST IT

1. Frontend opens at `http://localhost:3000`
2. Backend running on `http://localhost:5000`
3. Register/Login
4. Add transaction
5. See charts & AI insights!

---

**Ready to build the backend? Start with STEP 1!** 💪
