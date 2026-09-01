 🎯 Key Features Explained

**Smart Categorization**
Transactions are organized into categories:
- 💰 Income (Salary, Freelance, Investment, Bonus, Gift)
- 🍔 Food & Dining
- 🚗 Transport
- 🎬 Entertainment
- 💡 Utilities
- 🏥 Health
- 🛍️ Shopping
- 📌 Other

**AI Insights**
- Analyzes spending patterns
- Provides budget recommendations
- Suggests savings opportunities
- Uses OpenAI GPT-3.5 API

**Data Security**
- Passwords hashed with bcryptjs
- JWT token authentication
- Protected API routes
- Secure database with MongoDB

---

📊 Sample Data

json
{
  "transactions": [
    {
      "description": "Grocery Shopping",
      "amount": 2500,
      "category": "Food",
      "type": "expense",
      "date": "2026-01-09"
    },
    {
      "description": "Freelance Project",
      "amount": 15000,
      "category": "Salary",
      "type": "income",
      "date": "2026-01-08"
    }
  ]
}


---

🚀 Deployment

 **Frontend (Vercel)**
```bash
npm run build
# Deploy 'build' folder to Vercel
```

 **Backend (Railway/Render)**
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

 **Database (MongoDB Atlas)**
1. Create free cluster on MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Database is ready!

 📸 Screenshots

[Add screenshots of:
- Login page
- Dashboard
- Charts
- AI Insights
- Reports page
]

🐛 Known Issues

- OpenAI API key required for AI insights (optional)
- MongoDB must be running locally or configured with Atlas


🔮 Future Enhancements

- [ ] Export reports as PDF
- [ ] Budget goals and alerts
- [ ] Recurring transactions
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Dark mode
- [ ] Email notifications
- [ ] Social sharing
- [ ] Data import/export
- [ ] Advanced filtering


## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👤 Author

**Manasa HM**
- GitHub: [@Mansa16-HM](https://github.com/Mansa16-HM)
- Email: manasahm30@gmail.com

🙏 Acknowledgments

- OpenAI for GPT-3.5 API
- MongoDB for database
- Chart.js for visualizations
- Tailwind CSS for styling
- React.js community

📞 Support

If you find any bugs or have feature requests, please:
1. Open an issue on GitHub
2. Email: manasahm30@gmail.com
3. Check existing issues first

 🌟 Show Your Support

If you found this project helpful, please:
- ⭐ Star the repository
- 🔀 Fork it
- 📢 Share it with others
- 💬 Give feedback

**Made with ❤️ by Manasa**
