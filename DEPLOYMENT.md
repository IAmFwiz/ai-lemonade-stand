# 🍋 AI Lemonade Stand - Deployment Guide

## 📦 What's Included

This package contains a fully functional AI Lemonade Stand demonstration website with:

- **3 AI-Managed Lemonade Stands** (La Jolla, Gaslamp Quarter, Coronado Beach)
- **3 AI-Managed Wholesalers** (Citrus Valley, Sunshine Grove, Tropical Harvest)
- **7 AI Agents** managing different aspects of the business
- **Real-time Financial Tracking** with revenue, expenses, and net profit
- **Automated Supply Chain** with auto-restock functionality
- **Bi-weekly Payroll Processing** managed by AI agents
- **Complete Transaction Logging** showing AI agent activities

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
# or
node test-server.js

# Open in browser
http://localhost:3000
```

### Option 2: Production Deployment
```bash
# Install dependencies
npm install

# Start production server
npm start
# or
node test-server.js

# The server will run on the port specified in your hosting environment
```

## 📁 File Structure

```
ai-lemonade-stand/
├── public/                 # Frontend files
│   └── index.html         # Main website interface
├── src/                   # Original backend (has syntax error)
│   ├── index.js          # Main server file (broken)
│   ├── models/           # Business logic classes
│   └── services/         # AI management services
├── test-server.js        # ✅ WORKING server (use this!)
├── package.json          # Dependencies and scripts
├── README.md            # Original documentation
└── DEPLOYMENT.md        # This file
```

## ⚠️ Important Notes

### Use `test-server.js` Instead of `src/index.js`
- The original `src/index.js` has a syntax error
- `test-server.js` is the working version with all features
- All functionality has been implemented in `test-server.js`

### Environment Variables
- Copy `.env.example` to `.env` if needed
- The server works without environment variables for demo purposes

## 🌐 Deployment Options

### 1. Heroku
```bash
# Create Procfile
echo "web: node test-server.js" > Procfile

# Deploy
git add .
git commit -m "Deploy AI Lemonade Stand"
git push heroku main
```

### 2. Railway
```bash
# Connect your GitHub repo
# Railway will auto-detect Node.js and deploy
```

### 3. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 4. DigitalOcean App Platform
```bash
# Connect your GitHub repo
# Set build command: npm install
# Set run command: node test-server.js
```

## 🔧 Configuration

### Port Configuration
The server uses `process.env.PORT || 3000` so it will work on any hosting platform.

### Environment Variables (Optional)
```bash
PORT=3000                    # Server port
NODE_ENV=production          # Environment
```

## 📊 Features Demonstrated

### 🤖 AI Agent Management
- **Stand Agents**: Manage inventory, pricing, payroll
- **Wholesaler Agents**: Manage supply, pricing, inventory
- **Customer Agents**: Make purchases and manage wallets

### 💰 Financial Tracking
- **Revenue**: From lemonade sales
- **Expenses**: From supply orders and payroll
- **Net Profit**: Revenue - Expenses
- **Real-time Updates**: All financials update with each transaction

### 🔄 Automated Supply Chain
- **Auto-restock**: When lemonade < 50 cups
- **Payment Processing**: Stand pays wholesaler for lemons
- **Inventory Management**: Lemons converted to lemonade
- **Transaction Logging**: All AI agent activities tracked

### 📅 Payroll System
- **Bi-weekly Processing**: Every 14 days
- **Employee Management**: 3 employees per stand
- **Cost Calculation**: Salary + healthcare + taxes
- **AI Agent Managed**: Fully automated

## 🎯 Perfect for Demonstrations

This website showcases:
- ✅ **Autonomous Business Operations**
- ✅ **AI Agent Collaboration**
- ✅ **Real-time Financial Modeling**
- ✅ **Supply Chain Automation**
- ✅ **Complete Transaction Transparency**

## 🔄 Tomorrow's Enhancements

Consider adding:
- Weather-based pricing
- Customer demand simulation
- More complex AI decision making
- Real-time market dynamics
- Advanced financial reporting

## 📞 Support

If you encounter any issues:
1. Make sure you're using `test-server.js` (not `src/index.js`)
2. Check that all dependencies are installed (`npm install`)
3. Verify the port is available (default: 3000)

---

**🍋 Ready to demonstrate the future of autonomous business! 🚀** 