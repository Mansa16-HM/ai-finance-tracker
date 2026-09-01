const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });

    const categoryTotals = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    if (Object.keys(categoryTotals).length === 0) {
      return res.json({
        categoryTotals: {},
        insights: 'Add some transactions to get AI-powered financial insights!',
      });
    }

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