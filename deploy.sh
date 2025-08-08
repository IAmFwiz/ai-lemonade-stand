#!/bin/bash

echo "🍋 AI Lemonade Stand - Deployment Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Test the server
echo "🧪 Testing the server..."
timeout 5s node test-server.js &
SERVER_PID=$!

sleep 3

if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is working correctly"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server test failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Deployment package is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Upload this folder to your hosting platform"
echo "2. Set the start command to: node test-server.js"
echo "3. The server will run on the port specified by your hosting platform"
echo ""
echo "🌐 For local testing:"
echo "   npm start"
echo "   or"
echo "   node test-server.js"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions" 