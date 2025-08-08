const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for development
}));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Sample data - Restored to original 3 stands and 3 wholesalers
const sampleAgents = [
  {
    id: 'agent-1',
    name: "Ryan's Agent",
    wallet: {
      usdcBalance: 10000,
      creditCardBalance: 20000
    },
    reputation: {
      score: 100
    }
  },
  {
    id: 'agent-2',
    name: 'La Jolla Stand Agent',
    wallet: {
      usdcBalance: 5000,
      creditCardBalance: 10000
    },
    reputation: {
      score: 95
    }
  },
  {
    id: 'agent-3',
    name: 'Gaslamp Stand Agent',
    wallet: {
      usdcBalance: 3000,
      creditCardBalance: 8000
    },
    reputation: {
      score: 88
    }
  },
  {
    id: 'agent-4',
    name: 'Coronado Stand Agent',
    wallet: {
      usdcBalance: 4000,
      creditCardBalance: 12000
    },
    reputation: {
      score: 92
    }
  },
  {
    id: 'agent-5',
    name: 'Citrus Valley Agent',
    wallet: {
      usdcBalance: 15000,
      creditCardBalance: 25000
    },
    reputation: {
      score: 98
    }
  },
  {
    id: 'agent-6',
    name: 'Sunshine Grove Agent',
    wallet: {
      usdcBalance: 12000,
      creditCardBalance: 20000
    },
    reputation: {
      score: 94
    }
  },
  {
    id: 'agent-7',
    name: 'Tropical Harvest Agent',
    wallet: {
      usdcBalance: 8000,
      creditCardBalance: 15000
    },
    reputation: {
      score: 89
    }
  }
];

const sampleStands = [
  {
    id: 'stand-1',
    name: 'La Jolla Lemonade',
    location: 'La Jolla Cove',
    status: 'active',
    pricing: {
      currentPrice: 4.50,
      basePrice: 3.00,
      weatherMultiplier: 1.5
    },
    inventory: {
      lemonade: 25,
      lemons: 200,
      sugar: 50,
      cups: 500
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0,
      netProfit: 0
    },
    autoOrdering: {
      enabled: true,
      preferredWholesaler: 'wholesaler-1',
      reorderThreshold: 30
    },
    payrollSchedule: {
      frequency: 'biweekly',
      lastPayrollDate: new Date('2025-07-22'), // 2 weeks ago
      nextPayrollDate: new Date('2025-08-05'), // This week (proper bi-weekly)
      autoProcess: true,
      payrollHistory: []
    },
    employees: [
      { id: 'emp1', name: 'Alex Johnson', position: 'Stand Manager', salary: 2800, healthcare: 400 },
      { id: 'emp2', name: 'Sarah Chen', position: 'Cashier', salary: 2200, healthcare: 350 },
      { id: 'emp3', name: 'Mike Rodriguez', position: 'Prep Cook', salary: 2400, healthcare: 380 }
    ]
  },
  {
    id: 'stand-2',
    name: 'Gaslamp Quarter Lemonade',
    location: 'Downtown San Diego',
    status: 'active',
    pricing: {
      currentPrice: 3.75,
      basePrice: 2.50,
      weatherMultiplier: 1.3
    },
    inventory: {
      lemonade: 20,
      lemons: 240,
      sugar: 60,
      cups: 600
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0,
      netProfit: 0
    },
    autoOrdering: {
      enabled: true,
      preferredWholesaler: 'wholesaler-2',
      reorderThreshold: 35
    },
    payrollSchedule: {
      frequency: 'biweekly',
      lastPayrollDate: new Date('2025-07-22'), // 2 weeks ago
      nextPayrollDate: new Date('2025-08-05'), // This week (proper bi-weekly)
      autoProcess: true,
      payrollHistory: []
    },
    employees: [
      { id: 'emp4', name: 'Emma Davis', position: 'Stand Manager', salary: 2600, healthcare: 380 },
      { id: 'emp5', name: 'Carlos Martinez', position: 'Cashier', salary: 2000, healthcare: 320 },
      { id: 'emp6', name: 'Lisa Wang', position: 'Prep Cook', salary: 2200, healthcare: 350 }
    ]
  },
  {
    id: 'stand-3',
    name: 'Coronado Beach Lemonade',
    location: 'Coronado Beach',
    status: 'active',
    pricing: {
      currentPrice: 3.25,
      basePrice: 2.00,
      weatherMultiplier: 1.2
    },
    inventory: {
      lemonade: 15,
      lemons: 240,
      sugar: 70,
      cups: 700
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0,
      netProfit: 0
    },
    autoOrdering: {
      enabled: true,
      preferredWholesaler: 'wholesaler-3',
      reorderThreshold: 40
    },
    payrollSchedule: {
      frequency: 'biweekly',
      lastPayrollDate: new Date('2025-07-22'), // 2 weeks ago
      nextPayrollDate: new Date('2025-08-05'), // This week (proper bi-weekly)
      autoProcess: true,
      payrollHistory: []
    },
    employees: [
      { id: 'emp7', name: 'Jake Wilson', position: 'Stand Manager', salary: 2400, healthcare: 360 },
      { id: 'emp8', name: 'Maria Garcia', position: 'Cashier', salary: 1800, healthcare: 300 },
      { id: 'emp9', name: 'Tom Anderson', position: 'Prep Cook', salary: 2000, healthcare: 330 }
    ]
  }
];

const sampleWholesalers = [
  {
    id: 'wholesaler-1',
    name: 'Citrus Valley Distributors',
    location: { city: 'Riverside County', country: 'US' },
    quality: 'premium',
    description: 'Organic, hand-picked California lemons',
    status: 'active',
    inventory: {
      lemons: 3500,
      lemonPrice: 0.75
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0
    },
    employees: [
      { name: 'AI Manager 1', role: 'Inventory Manager' },
      { name: 'AI Worker 6', role: 'Harvester' },
      { name: 'AI Worker 7', role: 'Quality Control' }
    ]
  },
  {
    id: 'wholesaler-2',
    name: 'Sunshine Grove Supply Co.',
    location: { city: 'Imperial Valley', country: 'US' },
    quality: 'standard',
    description: 'Fresh Florida citrus, good value',
    status: 'active',
    inventory: {
      lemons: 3600,
      lemonPrice: 0.50
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0
    },
    employees: [
      { name: 'AI Manager 2', role: 'Supply Manager' },
      { name: 'AI Worker 8', role: 'Harvester' }
    ]
  },
  {
    id: 'wholesaler-3',
    name: 'Tropical Harvest Importers',
    location: { city: 'San Diego Harbor', country: 'US' },
    quality: 'budget',
    description: 'Affordable imported lemons',
    status: 'active',
    inventory: {
      lemons: 2800,
      lemonPrice: 0.35
    },
    finances: {
      revenue: 0,
      profit: 0,
      expenses: 0
    },
    employees: [
      { name: 'AI Manager 3', role: 'Import Manager' },
      { name: 'AI Worker 9', role: 'Harvester' },
      { name: 'AI Worker 10', role: 'Quality Control' }
    ]
  }
];

const sampleTransactions = [
  {
    id: 'tx-1',
    type: 'payment',
    category: 'Lemonade Purchase',
    status: 'completed',
    fromAgent: "Ryan's Agent",
    toAgent: 'La Jolla Lemonade',
    amount: 22.5,
    description: 'Purchase of 5 lemonades at $4.50 each',
    timestamp: new Date().toISOString()
  }
];

// Simple test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Lemonade Stand Server is running! 🍋',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    features: [
      'AI Agent Management',
      'Lemonade Stand Operations', 
      'Wholesaler Management',
      'Payment Processing',
      'Weather-based Pricing'
    ]
  });
});

// API endpoints that the frontend expects
app.get('/api/agents', (req, res) => {
  res.json(sampleAgents);
});

app.get('/api/stands', (req, res) => {
  res.json(sampleStands);
});

app.get('/api/wholesalers', (req, res) => {
  res.json(sampleWholesalers);
});

app.get('/api/transactions', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const transactions = sampleTransactions.slice(startIndex, endIndex);
  
  const pagination = {
    currentPage: page,
    pageSize: pageSize,
    totalPages: Math.ceil(sampleTransactions.length / pageSize),
    totalTransactions: sampleTransactions.length,
    hasNextPage: endIndex < sampleTransactions.length,
    hasPreviousPage: page > 1
  };
  
  res.json({
    transactions: transactions,
    pagination: pagination
  });
});

app.get('/api/transactions/system', (req, res) => {
  res.json(sampleTransactions);
});

// Get specific agent
app.get('/api/agents/:agentId', (req, res) => {
  const agent = sampleAgents.find(a => a.id === req.params.agentId);
  if (agent) {
    res.json(agent);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

// Buy lemonade from stand
app.post('/api/stands/:standId/buy', (req, res) => {
  const { buyerAgentId, quantity } = req.body;
  const stand = sampleStands.find(s => s.id === req.params.standId);
  const buyer = sampleAgents.find(a => a.id === buyerAgentId);
  
  if (!stand) {
    return res.status(404).json({ error: 'Stand not found' });
  }
  
  if (!buyer) {
    return res.status(404).json({ error: 'Buyer agent not found' });
  }
  
  const totalPrice = stand.pricing.currentPrice * quantity;
  
  if (buyer.wallet.usdcBalance < totalPrice) {
    return res.status(400).json({ error: 'Insufficient USDC balance' });
  }
  
  // Check if stand has enough lemonade
  if (stand.inventory.lemonade < quantity) {
    return res.status(400).json({ error: 'Not enough lemonade available' });
  }
  
  // Update financial data
  buyer.wallet.usdcBalance -= totalPrice;
  stand.finances.revenue += totalPrice;
  stand.finances.profit += totalPrice * 0.6; // Assume 60% profit margin
  stand.finances.expenses += totalPrice * 0.4; // Assume 40% cost
  stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
  
  // Update inventory
  stand.inventory.lemonade = Math.max(0, stand.inventory.lemonade - quantity);
  
  // Auto-restock if lemonade gets low
  if (stand.inventory.lemonade < stand.autoOrdering.reorderThreshold) {
    console.log(`🔄 Auto-restock triggered for ${stand.name}: lemonade=${stand.inventory.lemonade}, threshold=${stand.autoOrdering.reorderThreshold}`);
    autoRestockStand(stand);
  }
  
  // Check payroll schedule
  checkPayrollSchedules();
  
  // Create new transaction
  const newTransaction = {
    id: `tx-${Date.now()}`,
    type: 'payment',
    category: 'Lemonade Purchase',
    status: 'completed',
    fromAgent: buyer.name,
    toAgent: `${stand.name} Agent`,
    amount: totalPrice,
    description: `Purchase of ${quantity} lemonades at $${stand.pricing.currentPrice.toFixed(2)} each`,
    timestamp: new Date().toISOString()
  };
  
  sampleTransactions.unshift(newTransaction);
  
  // Simulate successful purchase
  res.json({
    success: true,
    purchase: {
      standId: stand.id,
      buyerAgentId: buyer.id,
      quantity: quantity,
      unitPrice: stand.pricing.currentPrice,
      totalPrice: totalPrice
    },
    updatedBalances: {
      buyerBalance: buyer.wallet.usdcBalance,
      standRevenue: stand.finances.revenue,
      standProfit: stand.finances.profit
    }
  });
});

// Payroll endpoint
app.post('/api/stands/:standId/payroll', (req, res) => {
  const { standId } = req.params;
  const stand = sampleStands.find(s => s.id === standId);
  
  if (!stand) {
    return res.status(404).json({ error: 'Stand not found' });
  }
  
  const payrollTransaction = processPayroll(stand);
  
  if (payrollTransaction) {
    res.json({
      success: true,
      message: 'Payroll processed',
      payroll: payrollTransaction,
      nextPayrollDate: stand.payrollSchedule.nextPayrollDate
    });
  } else {
    res.json({
      success: false,
      message: 'Payroll not due yet',
      nextPayrollDate: stand.payrollSchedule.nextPayrollDate,
      daysUntilPayroll: Math.ceil((stand.payrollSchedule.nextPayrollDate - new Date()) / (1000 * 60 * 60 * 24))
    });
  }
});

// Auto-restock function
function autoRestockStand(stand) {
  const wholesaler = sampleWholesalers.find(w => w.id === stand.autoOrdering.preferredWholesaler);
  if (!wholesaler) {
    console.log(`❌ No wholesaler found for ${stand.name}`);
    return;
  }
  
  // Calculate how many lemons to order (enough to make 50 lemonades)
  const lemonsNeeded = 50 * 2; // 2 lemons per lemonade
  const orderCost = lemonsNeeded * wholesaler.inventory.lemonPrice;
  
  console.log(`🔄 Auto-restock calculation for ${stand.name}:`);
  console.log(`   Lemons needed: ${lemonsNeeded}`);
  console.log(`   Order cost: $${orderCost}`);
  console.log(`   Stand revenue: $${stand.finances.revenue}`);
  
  // Check if stand has enough money
  if (stand.finances.revenue < orderCost) {
    console.log(`❌ ${stand.name} doesn't have enough money for restock`);
    return;
  }
  
  // Check if wholesaler has enough lemons
  if (wholesaler.inventory.lemons < lemonsNeeded) {
    console.log(`❌ ${wholesaler.name} doesn't have enough lemons`);
    return;
  }
  
  // Transfer money from stand to wholesaler
  stand.finances.revenue -= orderCost; // Stand pays for the order
  wholesaler.finances.revenue += orderCost; // Wholesaler receives payment
  
  // Calculate wholesaler cost of goods sold (COGS)
  const wholesalerCOGS = lemonsNeeded * 0.25; // Assume wholesaler buys lemons at $0.25 each
  const wholesalerProfit = orderCost - wholesalerCOGS; // Revenue - COGS = Profit
  
  // Update wholesaler inventory and finances
  wholesaler.inventory.lemons -= lemonsNeeded;
  wholesaler.finances.revenue += orderCost;
  wholesaler.finances.expenses += wholesalerCOGS;
  wholesaler.finances.profit += wholesalerProfit;
  
  // Update stand inventory and finances
  stand.inventory.lemons += lemonsNeeded;
  stand.inventory.lemonade += 50; // Convert lemons to lemonade
  stand.finances.expenses += orderCost;
  stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
  
  // Create restock transaction
  const restockTransaction = {
    id: `tx-restock-${Date.now()}`,
    type: 'payment',
    category: 'Supply Order',
    status: 'completed',
    fromAgent: `${stand.name} Agent`,
    toAgent: `${wholesaler.name} Agent`,
    amount: orderCost,
    description: `AI Agent Auto-restock: ${lemonsNeeded} lemons ordered from ${wholesaler.name} Agent`,
    timestamp: new Date().toISOString()
  };
  
  sampleTransactions.unshift(restockTransaction);
  
  console.log(`✅ Auto-restocked ${stand.name}: ${lemonsNeeded} lemons → 50 lemonades`);
}

// Smart auto-restock function that only restocks what was actually sold
function smartAutoRestockStand(stand, soldQuantity) {
  const wholesaler = sampleWholesalers.find(w => w.id === stand.autoOrdering.preferredWholesaler);
  if (!wholesaler) {
    console.log(`❌ No wholesaler found for ${stand.name}`);
    return;
  }
  
  // Smart inventory management: only order what's needed + small buffer
  const currentLemons = stand.inventory.lemons;
  const currentLemonade = stand.inventory.lemonade;
  const targetLemonade = Math.max(stand.autoOrdering.reorderThreshold + 10, soldQuantity + 5); // Buffer for future sales
  const lemonadeNeeded = targetLemonade - currentLemonade;
  const lemonsNeeded = lemonadeNeeded * 2; // 2 lemons per lemonade
  
  // Don't order if we already have enough lemons to make the needed lemonade
  if (currentLemons >= lemonsNeeded) {
    console.log(`🔄 ${stand.name} has enough lemons (${currentLemons}) to make ${Math.floor(currentLemons/2)} lemonades`);
    // Convert existing lemons to lemonade
    const lemonadeToMake = Math.min(lemonadeNeeded, Math.floor(currentLemons/2));
    stand.inventory.lemons -= lemonadeToMake * 2;
    stand.inventory.lemonade += lemonadeToMake;
    console.log(`✅ Converted ${lemonadeToMake * 2} lemons to ${lemonadeToMake} lemonades for ${stand.name}`);
    return;
  }
  
  const orderCost = lemonsNeeded * wholesaler.inventory.lemonPrice;
  
  console.log(`🔄 Smart auto-restock calculation for ${stand.name}:`);
  console.log(`   Current lemonade: ${currentLemonade}, target: ${targetLemonade}`);
  console.log(`   Current lemons: ${currentLemons}, needed: ${lemonsNeeded}`);
  console.log(`   Order cost: $${orderCost}`);
  console.log(`   Stand revenue: $${stand.finances.revenue}`);
  
  // Check if stand has enough money
  if (stand.finances.revenue < orderCost) {
    console.log(`❌ ${stand.name} doesn't have enough money for restock`);
    return;
  }
  
  // Check if wholesaler has enough lemons
  if (wholesaler.inventory.lemons < lemonsNeeded) {
    console.log(`❌ ${wholesaler.name} doesn't have enough lemons`);
    return;
  }
  
  // Transfer money from stand to wholesaler
  stand.finances.revenue -= orderCost;
  wholesaler.finances.revenue += orderCost;
  
  // Calculate wholesaler cost of goods sold (COGS)
  const wholesalerCOGS = lemonsNeeded * 0.25;
  const wholesalerProfit = orderCost - wholesalerCOGS;
  
  // Update wholesaler inventory and finances
  wholesaler.inventory.lemons -= lemonsNeeded;
  wholesaler.finances.revenue += orderCost;
  wholesaler.finances.expenses += wholesalerCOGS;
  wholesaler.finances.profit += wholesalerProfit;
  
  // Update stand inventory and finances
  stand.inventory.lemons += lemonsNeeded;
  stand.inventory.lemonade += lemonadeNeeded; // Convert to lemonade immediately
  stand.finances.expenses += orderCost;
  stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
  
  // Dynamic pricing: adjust price based on costs and demand
  const lemonCost = wholesaler.inventory.lemonPrice;
  const costPerLemonade = lemonCost * 2 + 0.50; // 2 lemons + sugar/cups
  const minPrice = costPerLemonade * 1.3; // 30% markup minimum
  const currentPrice = stand.pricing.currentPrice;
  
  if (currentPrice < minPrice) {
    stand.pricing.currentPrice = Math.max(minPrice, stand.pricing.basePrice);
    console.log(`💰 ${stand.name} adjusted price from $${currentPrice} to $${stand.pricing.currentPrice} (cost: $${costPerLemonade.toFixed(2)})`);
  }
  
  // Create restock transaction
  const restockTransaction = {
    id: `tx-restock-${Date.now()}`,
    type: 'payment',
    category: 'Supply Order',
    status: 'completed',
    fromAgent: `${stand.name} Agent`,
    toAgent: `${wholesaler.name} Agent`,
    amount: orderCost,
    description: `AI Agent Smart Auto-restock: ${lemonsNeeded} lemons → ${lemonadeNeeded} lemonades for ${stand.name}`,
    timestamp: new Date().toISOString()
  };
  
  sampleTransactions.unshift(restockTransaction);
  
  console.log(`✅ Smart auto-restocked ${stand.name}: ${lemonsNeeded} lemons → ${lemonadeNeeded} lemonades`);
}

// Function to process payroll for a stand
function processPayroll(stand) {
  const now = new Date();
  
  // Check if it's time for payroll
  if (now >= stand.payrollSchedule.nextPayrollDate) {
    console.log(`📅 Processing bi-weekly payroll for ${stand.name}`);
    
    // Calculate total payroll costs
    const totalPayroll = stand.employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalHealthcare = stand.employees.reduce((sum, emp) => sum + emp.healthcare, 0);
    const payrollTaxes = totalPayroll * 0.15; // 15% payroll taxes
    const unemploymentInsurance = totalPayroll * 0.06; // 6% UI
    const workersComp = totalPayroll * 0.02; // 2% workers comp
    
    const totalEmployerCosts = totalPayroll + totalHealthcare + payrollTaxes + unemploymentInsurance + workersComp;
    
    // Update stand finances
    stand.finances.expenses += totalEmployerCosts;
    stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
    
    // Create payroll transaction
    const payrollTransaction = {
      id: `tx-payroll-${Date.now()}`,
      type: 'payment',
      category: 'Payroll',
      status: 'completed',
      fromAgent: `${stand.name} Agent`,
      toAgent: 'Employees',
      amount: totalEmployerCosts,
      description: `AI Agent Bi-weekly payroll: ${stand.employees.length} employees`,
      timestamp: new Date().toISOString(),
      details: {
        grossPayroll: totalPayroll,
        healthcare: totalHealthcare,
        payrollTaxes: payrollTaxes,
        unemploymentInsurance: unemploymentInsurance,
        workersComp: workersComp,
        employeeCount: stand.employees.length
      }
    };
    
    sampleTransactions.unshift(payrollTransaction);
    
    // Update payroll schedule
    stand.payrollSchedule.lastPayrollDate = new Date();
    stand.payrollSchedule.nextPayrollDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Next bi-weekly
    stand.payrollSchedule.payrollHistory.push(payrollTransaction);
    
    console.log(`💳 Processed payroll for ${stand.name}: $${totalEmployerCosts.toFixed(2)}`);
    console.log(`   📅 Next payroll: ${stand.payrollSchedule.nextPayrollDate.toLocaleDateString()}`);
    
    return payrollTransaction;
  }
  
  return null;
}

// Function to check payroll schedules for all stands
function checkPayrollSchedules() {
  sampleStands.forEach(stand => {
    if (stand.payrollSchedule.autoProcess) {
      processPayroll(stand);
    }
  });
}

// Smart fulfillment plan creation
function createFulfillmentPlan(quantity) {
  const activeStands = sampleStands.filter(stand => stand.status === 'active');
  
  // Step 1: Try to fulfill from existing lemonade inventory (cheapest first)
  let remainingQuantity = quantity;
  let fulfillmentStands = [];
  let totalCost = 0;
  
  // Sort stands by price (cheapest first)
  const sortedStands = [...activeStands].sort((a, b) => a.pricing.currentPrice - b.pricing.currentPrice);
  
  // First pass: use existing lemonade inventory
  for (const stand of sortedStands) {
    if (remainingQuantity <= 0) break;
    
    const availableFromStand = Math.min(remainingQuantity, stand.inventory.lemonade);
    if (availableFromStand > 0) {
      const cost = availableFromStand * stand.pricing.currentPrice;
      fulfillmentStands.push({
        stand: stand,
        quantity: availableFromStand,
        cost: cost,
        source: 'existing_inventory'
      });
      totalCost += cost;
      remainingQuantity -= availableFromStand;
    }
  }
  
  // Step 2: If still need more, convert lemons to lemonade
  if (remainingQuantity > 0) {
    for (const stand of sortedStands) {
      if (remainingQuantity <= 0) break;
      
      const lemonsAvailable = stand.inventory.lemons;
      const lemonadeFromLemons = Math.min(remainingQuantity, Math.floor(lemonsAvailable / 2)); // 2 lemons per lemonade
      
      if (lemonadeFromLemons > 0) {
        const cost = lemonadeFromLemons * stand.pricing.currentPrice;
        fulfillmentStands.push({
          stand: stand,
          quantity: lemonadeFromLemons,
          cost: cost,
          source: 'converted_from_lemons',
          lemonsUsed: lemonadeFromLemons * 2
        });
        totalCost += cost;
        remainingQuantity -= lemonadeFromLemons;
      }
    }
  }
  
  // Step 3: If still need more, buy lemons and convert - be more aggressive
  if (remainingQuantity > 0) {
    for (const stand of sortedStands) {
      if (remainingQuantity <= 0) break;
      
      // Check if stand can afford to buy more lemons
      const wholesaler = sampleWholesalers.find(w => w.id === stand.autoOrdering.preferredWholesaler);
      if (wholesaler) {
        const lemonsNeeded = remainingQuantity * 2;
        const lemonCost = lemonsNeeded * wholesaler.inventory.lemonPrice;
        
        // Check if wholesaler has enough lemons
        const availableLemons = wholesaler.inventory.lemons;
        const lemonsCanBuy = Math.min(lemonsNeeded, availableLemons);
        const lemonadeCanMake = Math.floor(lemonsCanBuy / 2);
        
        if (lemonadeCanMake > 0) {
          const actualLemonCost = lemonsCanBuy * wholesaler.inventory.lemonPrice;
          const cost = lemonadeCanMake * stand.pricing.currentPrice;
          
          fulfillmentStands.push({
            stand: stand,
            quantity: lemonadeCanMake,
            cost: cost,
            source: 'bought_and_converted_lemons',
            lemonsBought: lemonsCanBuy,
            lemonCost: actualLemonCost,
            wholesaler: wholesaler
          });
          totalCost += cost;
          remainingQuantity -= lemonadeCanMake;
        }
      }
    }
  }
  
  // Step 4: If still need more, try other wholesalers
  if (remainingQuantity > 0) {
    for (const stand of sortedStands) {
      if (remainingQuantity <= 0) break;
      
      // Try all wholesalers, not just the preferred one
      for (const wholesaler of sampleWholesalers) {
        if (remainingQuantity <= 0) break;
        
        const lemonsNeeded = remainingQuantity * 2;
        const availableLemons = wholesaler.inventory.lemons;
        const lemonsCanBuy = Math.min(lemonsNeeded, availableLemons);
        const lemonadeCanMake = Math.floor(lemonsCanBuy / 2);
        
        if (lemonadeCanMake > 0) {
          const actualLemonCost = lemonsCanBuy * wholesaler.inventory.lemonPrice;
          const cost = lemonadeCanMake * stand.pricing.currentPrice;
          
          fulfillmentStands.push({
            stand: stand,
            quantity: lemonadeCanMake,
            cost: cost,
            source: 'bought_and_converted_lemons_alternative_wholesaler',
            lemonsBought: lemonsCanBuy,
            lemonCost: actualLemonCost,
            wholesaler: wholesaler
          });
          totalCost += cost;
          remainingQuantity -= lemonadeCanMake;
        }
      }
    }
  }
  
  // If we still can't fulfill, return null
  if (remainingQuantity > 0) {
    return null;
  }
  
  return {
    totalQuantity: quantity,
    totalCost: totalCost,
    stands: fulfillmentStands
  };
}

// Execute the fulfillment plan
function executeFulfillmentPlan(plan, agentName, paymentMethod) {
  for (const fulfillment of plan.stands) {
    const stand = fulfillment.stand;
    
    // Update stand finances
    stand.finances.revenue += fulfillment.cost;
    stand.finances.profit += fulfillment.cost * 0.6;
    stand.finances.expenses += fulfillment.cost * 0.4;
    stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
    
    // Update inventory based on source
    if (fulfillment.source === 'existing_inventory') {
      stand.inventory.lemonade = Math.max(0, stand.inventory.lemonade - fulfillment.quantity);
    } else if (fulfillment.source === 'converted_from_lemons') {
      stand.inventory.lemons -= fulfillment.lemonsUsed;
      stand.inventory.lemonade = Math.max(0, stand.inventory.lemonade - fulfillment.quantity);
    } else if (fulfillment.source === 'bought_and_converted_lemons' || fulfillment.source === 'bought_and_converted_lemons_alternative_wholesaler') {
      // Buy lemons from wholesaler and convert immediately
      const wholesaler = fulfillment.wholesaler;
      wholesaler.inventory.lemons -= fulfillment.lemonsBought;
      wholesaler.finances.revenue += fulfillment.lemonCost;
      
      // Update stand inventory - convert lemons to lemonade immediately
      stand.inventory.lemonade += fulfillment.quantity; // Add the lemonade directly
      stand.finances.expenses += fulfillment.lemonCost;
      stand.finances.netProfit = stand.finances.revenue - stand.finances.expenses;
    }
    
    // Smart auto-restock if needed
    if (stand.inventory.lemonade < stand.autoOrdering.reorderThreshold) {
      console.log(`🔄 Smart auto-restock triggered for ${stand.name}: lemonade=${stand.inventory.lemonade}, threshold=${stand.autoOrdering.reorderThreshold}`);
      smartAutoRestockStand(stand, fulfillment.quantity);
    }
  }
}

// Transactions endpoint with pagination
app.get('/api/transactions', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const totalTransactions = sampleTransactions.length;
  const totalPages = Math.ceil(totalTransactions / pageSize);
  const transactions = sampleTransactions.slice(startIndex, endIndex);
  
  res.json({
    transactions: transactions,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalTransactions: totalTransactions,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    features: ['AI Agent Management', 'Lemonade Stand Operations', 'Wholesaler Management', 'Payment Processing', 'Weather-based Pricing']
  });
});

// Agents endpoint
app.get('/api/agents', (req, res) => {
  res.json(sampleAgents);
});

// Stands endpoint
app.get('/api/stands', (req, res) => {
  res.json(sampleStands);
});

// Wholesalers endpoint
app.get('/api/wholesalers', (req, res) => {
  res.json(sampleWholesalers);
});

// Payment processor mapping for ACK integration
function getPaymentProcessor(paymentMethod) {
  const processors = {
    'usdc': { name: 'ACK-USDC', type: 'stablecoin', fee: 0 },
    'creditCard': { name: 'Visa/Mastercard', type: 'traditional', fee: 0.029 },
    'paypal': { name: 'PayPal', type: 'digital_wallet', fee: 0.029 },
    'stripe': { name: 'Stripe', type: 'payment_processor', fee: 0.029 },
    'auto': { name: 'ACK-Auto', type: 'intelligent_routing', fee: 0.015 }
  };
  return processors[paymentMethod] || processors['auto'];
}

// Agent prompt endpoint (simplified)
app.post('/api/agents/:agentId/prompt', (req, res) => {
  const { quantity, paymentMethod, quality } = req.body;
  const agent = sampleAgents.find(a => a.id === req.params.agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  // Smart demand fulfillment: find the best way to fulfill the order
  const fulfillmentPlan = createFulfillmentPlan(quantity);
  
  if (!fulfillmentPlan) {
    return res.status(400).json({ 
      error: 'Unable to fulfill order - insufficient inventory and resources',
      requestedQuantity: quantity,
      availableStands: sampleStands.map(s => ({
        name: s.name,
        price: s.pricing.currentPrice,
        available: s.inventory.lemonade,
        lemons: s.inventory.lemons
      }))
    });
  }
  
  const deliveryServices = ['Instacart', 'DoorDash', 'Postmates', 'GoPuff'];
  const selectedService = deliveryServices[Math.floor(Math.random() * deliveryServices.length)];
  const totalCost = fulfillmentPlan.totalCost;
  const deliveryFee = Math.random() * 5 + 2;
  
  // Get payment processor and calculate fees
  const processor = getPaymentProcessor(paymentMethod);
  const processingFee = totalCost * processor.fee;
  const totalWithDelivery = totalCost + deliveryFee + processingFee;
  
  // Update agent balance based on payment method
  if (paymentMethod === 'usdc') {
    agent.wallet.usdcBalance -= totalWithDelivery;
  } else {
    agent.wallet.creditCardBalance -= totalWithDelivery;
  }
  
  // Execute the fulfillment plan
  executeFulfillmentPlan(fulfillmentPlan, agent.name, paymentMethod);
  
  // Create individual transactions for each stand
  fulfillmentPlan.stands.forEach((fulfillment, index) => {
    const standTransaction = {
      id: `tx-${Date.now()}-${index}`,
      type: 'payment',
      category: 'Lemonade Purchase',
      status: 'completed',
      fromAgent: agent.name,
      toAgent: fulfillment.stand.name,
      amount: fulfillment.cost,
      description: `${fulfillment.quantity} lemonades from ${fulfillment.stand.name} (${fulfillment.source.replace(/_/g, ' ')}) at $${fulfillment.stand.pricing.currentPrice} each`,
      timestamp: new Date().toISOString(),
      paymentProcessor: processor.name,
      details: {
        quantity: fulfillment.quantity,
        source: fulfillment.source,
        pricePerLemonade: fulfillment.stand.pricing.currentPrice,
        totalCost: fulfillment.cost
      }
    };
    sampleTransactions.unshift(standTransaction);
  });
  
  // Create summary transaction with deduplicated stand names
  const uniqueStandNames = [...new Set(fulfillmentPlan.stands.map(s => s.stand.name))];
  const summaryTransaction = {
    id: `tx-summary-${Date.now()}`,
    type: 'payment',
    category: 'Lemonade Purchase Summary',
    status: 'completed',
    fromAgent: agent.name,
    toAgent: uniqueStandNames.join(', '),
    amount: totalCost,
    description: `Order Summary: ${quantity} total lemonades via ${paymentMethod} (fulfilled by ${uniqueStandNames.length} stand(s))`,
    timestamp: new Date().toISOString(),
    paymentProcessor: processor.name,
    details: {
      totalQuantity: quantity,
      totalCost: totalCost,
      uniqueStands: uniqueStandNames.length,
      stands: fulfillmentPlan.stands.map(s => ({
        standName: s.stand.name,
        quantity: s.quantity,
        cost: s.cost,
        source: s.source,
        pricePerLemonade: s.stand.pricing.currentPrice
      }))
    }
  };
  
  sampleTransactions.unshift(summaryTransaction);
  
  res.json({
    success: true,
    message: 'Purchase executed successfully',
    agent: agent.name,
    quantity: quantity,
    paymentMethod: paymentMethod,
    paymentProcessor: processor.name,
    processingFee: processingFee,
    deliveryService: selectedService,
    fulfillmentPlan: fulfillmentPlan,
    totalCost: totalCost,
    deliveryFee: deliveryFee,
    totalWithDelivery: totalWithDelivery,
    remainingBalance: paymentMethod === 'usdc' ? agent.wallet.usdcBalance : agent.wallet.creditCardBalance,
    // Backward compatibility fields for frontend
    lemonadeStand: uniqueStandNames.join(', '),
    lemonadePrice: uniqueStandNames.length === 1 ? fulfillmentPlan.stands[0].stand.pricing.currentPrice : 'Multiple prices',
    standsUsed: fulfillmentPlan.stands.map(s => ({
      name: s.stand.name,
      quantity: s.quantity,
      price: s.stand.pricing.currentPrice,
      cost: s.cost
    }))
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍋 AI Lemonade Stand Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/test`);
  console.log(`🤖 Agents: http://localhost:${PORT}/api/agents`);
  console.log(`🍋 Stands: http://localhost:${PORT}/api/stands`);
  console.log(`📦 Wholesalers: http://localhost:${PORT}/api/wholesalers`);
  console.log(`💰 Transactions: http://localhost:${PORT}/api/transactions`);
}); 