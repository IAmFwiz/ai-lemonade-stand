# AI Lemonade Stand

A sophisticated Node.js/Express.js application that simulates an AI-powered lemonade stand business with intelligent inventory management, dynamic pricing, and multi-stand order fulfillment.

## Features

- **Intelligent Purchase Logic**: Automatically selects the cheapest lemonade stand with sufficient inventory
- **Smart Auto-Restocking**: Efficiently manages inventory by converting existing lemons to lemonade before ordering new supplies
- **Multi-Stand Order Fulfillment**: Large orders are fulfilled by intelligently combining inventory from multiple stands
- **Dynamic Pricing**: Prices adjust based on cost and demand to maintain profitability
- **Comprehensive Transaction Logging**: Detailed activity logs with pagination support
- **Real-time Inventory Management**: Tracks lemons, lemonade, and financial metrics across multiple stands

## Project Structure

```
ai-lemonade-stand/
├── test-server.js          # Main server file with all API endpoints
├── public/
│   └── index.html          # Frontend interface
├── package.json            # Project dependencies and scripts
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## API Endpoints

- `GET /api/agents` - List all AI agents
- `GET /api/stands` - List all lemonade stands
- `GET /api/wholesalers` - List all wholesalers
- `GET /api/transactions?page=1&pageSize=5` - Get paginated transaction history
- `POST /api/agents/:agentId/prompt` - Process purchase requests
- `GET /api/test` - Test endpoint

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the server**:
   ```bash
   npm start
   ```

3. **Access the application**:
   - Open your browser to `http://localhost:3000`
   - The server will be running on port 3000

## Key Features Explained

### Smart Auto-Restocking
The system intelligently manages inventory by:
- Converting existing lemons to lemonade when possible
- Only ordering new lemons when necessary
- Maintaining optimal inventory levels

### Multi-Stand Order Fulfillment
Large orders are fulfilled by:
1. Using existing lemonade inventory (cheapest first)
2. Converting existing lemons to lemonade
3. Buying new lemons and converting them
4. Combining inventory from multiple stands

### Dynamic Pricing
Prices automatically adjust based on:
- Cost per lemonade (lemons + overhead)
- Minimum markup requirements
- Market demand

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JavaScript** - Programming language
- **RESTful API** - API design pattern
- **In-memory Data Storage** - Sample data arrays

## Development

The project uses in-memory storage for demonstration purposes. In a production environment, you would want to integrate with a proper database.

## License

This project is for educational and demonstration purposes. 