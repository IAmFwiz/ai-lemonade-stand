const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const Agent = require('./models/Agent');
const LemonadeStand = require('./models/LemonadeStand');
const Wholesaler = require('./models/Wholesaler');
const PaymentService = require('./services/PaymentService');
const WeatherService = require('./services/WeatherService');


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

// Initialize services
const paymentService = new PaymentService();
const weatherService = new WeatherService();

// In-memory storage (in production, use a database)
const agents = new Map();
const lemonadeStands = new Map();
const wholesalers = new Map();

// Sample locations for lemonade stands
const sampleLocations = [
  { city: 'New York', country: 'US' },
  { city: 'Los Angeles', country: 'US' },
  { city: 'Miami', country: 'US' },
  { city: 'Seattle', country: 'US' },
  { city: 'Phoenix', country: 'US' },
  { city: 'London', country: 'GB' },
  { city: 'Paris', country: 'FR' },
  { city: 'Tokyo', country: 'JP' },
  { city: 'Sydney', country: 'AU' },
  { city: 'Rio de Janeiro', country: 'BR' }
];

// Initialize with some sample data
function initializeSampleData() {
  // Create Ryan's agent with $10,000 USDC and $20,000 credit card balance
  const ryansAgent = new Agent('Ryan\'s Agent', 'ryan');
  ryansAgent.wallet.usdcBalance = 10000; // Set initial USDC balance to $10,000
  ryansAgent.wallet.creditCardBalance = 20000; // Add credit card balance
  ryansAgent.reputation.score = 100; // High reputation score
  
  // Create stand owner agents
  const laJollaAgent = new Agent('La Jolla Stand Agent', 'laJolla');
  laJollaAgent.wallet.usdcBalance = 5000;
  laJollaAgent.reputation.score = 95;
  
  const gaslampAgent = new Agent('Gaslamp Stand Agent', 'gaslamp');
  gaslampAgent.wallet.usdcBalance = 4500;
  gaslampAgent.reputation.score = 92;
  
  const coronadoAgent = new Agent('Coronado Stand Agent', 'coronado');
  coronadoAgent.wallet.usdcBalance = 4800;
  coronadoAgent.reputation.score = 88;
  
  agents.set(ryansAgent.id, ryansAgent);
  agents.set(laJollaAgent.id, laJollaAgent);
  agents.set(gaslampAgent.id, gaslampAgent);
  agents.set(coronadoAgent.id, coronadoAgent);

  // Create lemonade stands in San Diego area with unique pricing strategies
  
  // 1. La Jolla Lemonade - Premium location, organic ingredients, upscale branding
  const stand1 = new LemonadeStand(laJollaAgent.id, { city: 'San Diego', country: 'US' }, 'La Jolla Lemonade');
  stand1.pricing.basePrice = 4.50; // Premium pricing for upscale La Jolla area
  stand1.pricing.currentPrice = 4.50;
  stand1.inventory.lemonade = 5;
  stand1.location.quality = 'premium'; // Near La Jolla Cove, high foot traffic
  stand1.branding = {
    theme: 'organic-artisanal',
    features: ['organic lemons', 'small-batch', 'artisanal preparation'],
    targetDemographic: 'upscale'
  };
  
  // 2. Gaslamp Quarter Lemonade - Tourist hotspot, convenience pricing
  const stand2 = new LemonadeStand(gaslampAgent.id, { city: 'San Diego', country: 'US' }, 'Gaslamp Quarter Lemonade');
  stand2.pricing.basePrice = 3.30; // Moderate pricing for tourist area
  stand2.pricing.currentPrice = 3.30;
  stand2.inventory.lemonade = 5;
  stand2.location.quality = 'tourist'; // High foot traffic, tourist area
  stand2.branding = {
    theme: 'convenience-tourist',
    features: ['quick service', 'tourist-friendly', 'convenient location'],
    targetDemographic: 'tourists'
  };
  
  // 3. Coronado Beach Lemonade - Beach location, family-friendly pricing
  const stand3 = new LemonadeStand(coronadoAgent.id, { city: 'San Diego', country: 'US' }, 'Coronado Beach Lemonade');
  stand3.pricing.basePrice = 2.80; // Family-friendly pricing for beach area
  stand3.pricing.currentPrice = 2.80;
  stand3.inventory.lemonade = 5;
  stand3.location.quality = 'beach'; // Beach location, family demographic
  stand3.branding = {
    theme: 'family-beach',
    features: ['family-friendly', 'beach vibes', 'affordable'],
    targetDemographic: 'families'
  };
  
  lemonadeStands.set(stand1.id, stand1);
  lemonadeStands.set(stand2.id, stand2);
  lemonadeStands.set(stand3.id, stand3);

  // Create wholesaler agents
  const citrusAgent = new Agent('Citrus Valley Agent', 'citrus');
  citrusAgent.wallet.usdcBalance = 15000;
  citrusAgent.reputation.score = 98;
  
  const sunshineAgent = new Agent('Sunshine Grove Agent', 'sunshine');
  sunshineAgent.wallet.usdcBalance = 12000;
  sunshineAgent.reputation.score = 95;
  
  const tropicalAgent = new Agent('Tropical Harvest Agent', 'tropical');
  tropicalAgent.wallet.usdcBalance = 18000;
  tropicalAgent.reputation.score = 90;
  
  agents.set(citrusAgent.id, citrusAgent);
  agents.set(sunshineAgent.id, sunshineAgent);
  agents.set(tropicalAgent.id, tropicalAgent);

  // Initialize wholesalers/distributors with comprehensive pricing logic
  const wholesaler1 = new Wholesaler('Citrus Valley Distributors', citrusAgent.id, { city: 'California', country: 'US' });
  wholesaler1.quality = 'premium';
  wholesaler1.description = 'Organic, hand-picked California lemons';
  wholesaler1.pricingFactors = {
    basePrice: 0.45,
    qualityMultiplier: 1.8, // Premium organic certification
    farmingPractice: 'organic', // Higher cost due to organic certification
    sourceType: 'local', // California local, premium freshness
    volumeDiscounts: {
      50: 0.95, // 5% discount for 50+ lemons
      100: 0.90, // 10% discount for 100+ lemons
      200: 0.85  // 15% discount for 200+ lemons
    },
    seasonalAdjustment: 1.1, // 10% premium for consistent year-round supply
    valueAddedServices: {
      washing: true,
      sorting: true,
      packaging: 'premium',
      coldStorage: true
    },
    reliabilityScore: 0.98, // High reliability, fewer spoilage issues
    transportCost: 0.05, // Local transport
    certification: 'USDA Organic'
  };
  wholesaler1.inventory.lemonPrice = wholesaler1.calculateLemonPrice();
  
  const wholesaler2 = new Wholesaler('Sunshine Grove Supply Co.', sunshineAgent.id, { city: 'Florida', country: 'US' });
  wholesaler2.quality = 'standard';
  wholesaler2.description = 'Fresh Florida citrus, good value';
  wholesaler2.pricingFactors = {
    basePrice: 0.35,
    qualityMultiplier: 1.4, // Standard quality
    farmingPractice: 'conventional', // Standard farming methods
    sourceType: 'domestic', // Florida domestic
    volumeDiscounts: {
      50: 0.97, // 3% discount for 50+ lemons
      100: 0.94, // 6% discount for 100+ lemons
      200: 0.91  // 9% discount for 200+ lemons
    },
    seasonalAdjustment: 1.05, // 5% premium for consistent supply
    valueAddedServices: {
      washing: true,
      sorting: false,
      packaging: 'standard',
      coldStorage: false
    },
    reliabilityScore: 0.92, // Good reliability
    transportCost: 0.08, // Interstate transport
    certification: 'Florida Fresh'
  };
  wholesaler2.inventory.lemonPrice = wholesaler2.calculateLemonPrice();
  
  const wholesaler3 = new Wholesaler('Tropical Harvest Importers', tropicalAgent.id, { city: 'Mexico', country: 'MX' });
  wholesaler3.quality = 'budget';
  wholesaler3.description = 'Affordable imported lemons';
  wholesaler3.pricingFactors = {
    basePrice: 0.25,
    qualityMultiplier: 1.1, // Basic quality
    farmingPractice: 'conventional', // Standard farming
    sourceType: 'imported', // Mexican imports
    volumeDiscounts: {
      50: 0.98, // 2% discount for 50+ lemons
      100: 0.96, // 4% discount for 100+ lemons
      200: 0.94  // 6% discount for 200+ lemons
    },
    seasonalAdjustment: 1.0, // No seasonal premium
    valueAddedServices: {
      washing: false,
      sorting: false,
      packaging: 'basic',
      coldStorage: false
    },
    reliabilityScore: 0.85, // Basic reliability
    transportCost: 0.12, // International transport
    certification: 'Mexican Standard'
  };
  wholesaler3.inventory.lemonPrice = wholesaler3.calculateLemonPrice();
  
  wholesalers.set(wholesaler1.id, wholesaler1);
  wholesalers.set(wholesaler2.id, wholesaler2);
  wholesalers.set(wholesaler3.id, wholesaler3);

  // Set preferred wholesaler for stands based on their quality tier
  stand1.autoOrdering.preferredWholesaler = wholesaler1.id; // La Jolla uses premium
  stand2.autoOrdering.preferredWholesaler = wholesaler2.id; // Gaslamp uses standard
  stand3.autoOrdering.preferredWholesaler = wholesaler3.id; // Coronado uses budget

  console.log('📦 Initialized: 7 Agents (1 Buyer, 3 Stands, 3 Wholesalers), 3 Stands, 3 Wholesalers');
}

// Routes

// Get all agents
app.get('/api/agents', (req, res) => {
  const agentsList = Array.from(agents.values()).map(agent => agent.toJSON());
  res.json(agentsList);
});

// Execute agent prompt
app.post('/api/agents/:agentId/prompt', (req, res) => {
  try {
    const { quantity, paymentMethod, quality = 'standard' } = req.body;
    const agent = agents.get(req.params.agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    if (!paymentMethod || !['usdc', 'creditCard'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Payment method must be "usdc" or "creditCard"' });
    }

    if (!quality || !['standard', 'premium'].includes(quality)) {
      return res.status(400).json({ error: 'Quality must be "standard" or "premium"' });
    }

    // Simulate the agent finding the best delivery service and lemonade stand
    const deliveryServices = ['Instacart', 'DoorDash', 'Postmates', 'GoPuff'];
    const selectedService = deliveryServices[Math.floor(Math.random() * deliveryServices.length)];
    
    // Find the best lemonade stand that can fulfill the request
    const stands = Array.from(lemonadeStands.values());
    
    // Filter stands based on quality preference
    let candidateStands = stands;
    if (quality === 'premium') {
      // For premium requests, prioritize La Jolla (premium stand)
      candidateStands = stands.filter(stand => 
        stand.name.toLowerCase().includes('la jolla') || 
        stand.name.toLowerCase().includes('premium') ||
        stand.pricing.currentPrice >= 4.00 // High-priced stands are premium
      );
      
      // If no premium stands found, fall back to all stands
      if (candidateStands.length === 0) {
        candidateStands = stands;
      }
    } else {
      // For standard requests, include all stands for large orders
      // Only filter out premium stands for small orders to save money
      if (quantity <= 10) {
        candidateStands = stands.filter(stand => 
          !stand.name.toLowerCase().includes('la jolla') ||
          stand.pricing.currentPrice < 4.00
        );
      } else {
        // For large orders, use all stands regardless of premium status
        candidateStands = stands;
      }
      
      // If no standard stands found, fall back to all stands
      if (candidateStands.length === 0) {
        candidateStands = stands;
      }
    }
    
    // Multi-stand fulfillment logic
    let fulfillmentPlan = [];
    let remainingQuantity = quantity;
    let totalCost = 0;
    
    // Sort stands by preference (quality-based)
    let sortedStands = [...candidateStands];
    if (quality === 'premium') {
      // For premium, prioritize La Jolla first, then by price (highest first)
      sortedStands.sort((a, b) => {
        if (a.name.toLowerCase().includes('la jolla') && !b.name.toLowerCase().includes('la jolla')) return -1;
        if (!a.name.toLowerCase().includes('la jolla') && b.name.toLowerCase().includes('la jolla')) return 1;
        return b.pricing.currentPrice - a.pricing.currentPrice;
      });
    } else {
      // For standard, prioritize by price (lowest first)
      sortedStands.sort((a, b) => a.pricing.currentPrice - b.pricing.currentPrice);
    }
    
    // Try to fulfill from each stand
    console.log(`🔍 Debug: Starting fulfillment for ${quantity} cups`);
    console.log(`🔍 Debug: Sorted stands:`, sortedStands.map(s => `${s.name}: ${s.inventory.lemonade} cups`));
    
    for (const stand of sortedStands) {
      if (remainingQuantity <= 0) break;
      
      const availableAtStand = Math.min(stand.inventory.lemonade, remainingQuantity);
      console.log(`🔍 Debug: ${stand.name} - Available: ${stand.inventory.lemonade}, Taking: ${availableAtStand}, Remaining: ${remainingQuantity}`);
      
      if (availableAtStand > 0) {
        fulfillmentPlan.push({
          stand: stand,
          quantity: availableAtStand,
          cost: availableAtStand * stand.pricing.currentPrice
        });
        totalCost += availableAtStand * stand.pricing.currentPrice;
        remainingQuantity -= availableAtStand;
        console.log(`🔍 Debug: After ${stand.name} - Remaining: ${remainingQuantity}`);
      }
    }
    
    // Check if we can fulfill the entire request
    console.log(`🔍 Debug: Final remainingQuantity: ${remainingQuantity}`);
    
    // Calculate total available inventory
    const totalAvailable = stands.reduce((sum, stand) => sum + stand.inventory.lemonade, 0);
    console.log(`🔍 Debug: Cannot fulfill - Total available: ${totalAvailable}, Requested: ${quantity}`);
    
    // For any insufficient inventory, trigger proactive ordering and immediately fulfill
    if (totalAvailable < quantity) {
        console.log(`🚨 Insufficient inventory detected: ${quantity} cups requested, only ${totalAvailable} available`);
        console.log(`🔄 Triggering proactive ordering and immediate fulfillment...`);
        
        // Trigger ordering for all stands to build up inventory
        candidateStands.forEach(stand => {
          const preferredWholesaler = wholesalers.get(stand.autoOrdering.preferredWholesaler);
          if (preferredWholesaler) {
            const standAgent = agents.get(stand.agentId);
            const wholesalerAgent = agents.get(preferredWholesaler.ownerId);
            
            console.log(`📦 Proactive ordering: ${stand.name} → ${preferredWholesaler.name}`);
            if (standAgent && wholesalerAgent) {
              stand.checkInventoryAndOrder(preferredWholesaler, paymentService, standAgent, wholesalerAgent, true);
            } else {
              stand.checkInventoryAndOrder(preferredWholesaler, null, null, null, true);
            }
          }
        });
        
        // Immediately make lemonade with available ingredients
        candidateStands.forEach(stand => {
          if (stand.inventory.inventory.lemons > 0 && stand.inventory.inventory.sugar > 0) {
            const canMake = Math.min(
              Math.floor(stand.inventory.inventory.lemons / stand.inventory.lemonToLemonadeRatio),
              Math.floor(stand.inventory.inventory.sugar / 1),
              Math.floor(stand.inventory.inventory.cups / 1),
              Math.floor(stand.inventory.inventory.ice / 2),
              stand.inventory.maxLemonadeCapacity - stand.inventory.lemonade
            );
            
            if (canMake > 0) {
              try {
                stand.makeLemonade(canMake);
                console.log(`🍋 Emergency lemonade production: ${stand.name} made ${canMake} cups`);
              } catch (error) {
                console.log(`❌ Failed to make emergency lemonade at ${stand.name}: ${error.message}`);
              }
            }
          }
        });
        
        // Recalculate inventory after emergency production
        const updatedTotalAvailable = stands.reduce((sum, stand) => sum + stand.inventory.lemonade, 0);
        console.log(`📊 Updated inventory after emergency production: ${updatedTotalAvailable} cups`);
        
        // For large orders, charge for the full requested amount and immediately produce
        let adjustedQuantity = quantity;
        if (updatedTotalAvailable < quantity) {
          console.log(`⚠️ Large order detected: Charging for full ${quantity} cups and immediately producing`);
          // Keep the original quantity - charge for full amount
          adjustedQuantity = quantity;
          console.log(`🎯 Charging for full order: ${quantity} cups`);
        }
        
        // Re-run the fulfillment logic with updated inventory
        fulfillmentPlan = [];
        totalCost = 0;
        remainingQuantity = adjustedQuantity;
        
        // Distribute the full order across all stands
        for (const stand of sortedStands) {
          if (remainingQuantity <= 0) break;
          
          // For large orders, distribute evenly or by capacity
          let quantityForStand;
          if (quantity > 100) {
            // For very large orders, distribute evenly
            quantityForStand = Math.ceil(remainingQuantity / (sortedStands.length - sortedStands.indexOf(stand)));
          } else {
            // For smaller orders, use available inventory
            quantityForStand = Math.min(stand.inventory.lemonade, remainingQuantity);
          }
          
          if (quantityForStand > 0) {
            fulfillmentPlan.push({
              stand: stand,
              quantity: quantityForStand,
              cost: quantityForStand * stand.pricing.currentPrice
            });
            totalCost += quantityForStand * stand.pricing.currentPrice;
            remainingQuantity -= quantityForStand;
            
            // Immediately produce more lemonade if needed
            if (quantityForStand > stand.inventory.lemonade) {
              const needToProduce = quantityForStand - stand.inventory.lemonade;
              console.log(`🍋 Immediately producing ${needToProduce} more cups at ${stand.name}`);
              try {
                stand.makeLemonade(needToProduce);
              } catch (error) {
                console.log(`❌ Failed to produce additional lemonade at ${stand.name}: ${error.message}`);
              }
            }
          }
        }
        
        // If we still can't fulfill after emergency production, return error
        if (remainingQuantity > 0) {
          return res.status(400).json({ 
            error: `System temporarily unable to fulfill order. Available: ${updatedTotalAvailable} cups, Requested: ${adjustedQuantity}. Please try again in a moment as AI agents are restocking.`,
            availableInventory: stands.map(stand => ({
              name: stand.name,
              available: stand.inventory.lemonade,
              price: stand.pricing.currentPrice
            }))
          });
        }
      }
    }
    
    console.log(`🎯 Multi-stand fulfillment: ${fulfillmentPlan.length} stands needed for ${quantity} cups`);
    fulfillmentPlan.forEach((plan, index) => {
      console.log(`   ${index + 1}. ${plan.stand.name}: ${plan.quantity} cups @ $${plan.stand.pricing.currentPrice}/cup = $${plan.cost.toFixed(2)}`);
    });

    const deliveryFee = Math.random() * 5 + 2; // $2-7 delivery fee
    const totalWithDelivery = totalCost + deliveryFee;

    // Check if agent can afford the purchase with selected payment method
    const availableBalance = paymentMethod === 'usdc' ? agent.wallet.usdcBalance : agent.wallet.creditCardBalance;
    
    if (availableBalance < totalWithDelivery) {
      return res.status(400).json({ 
        error: 'Insufficient funds', 
        required: totalWithDelivery,
        available: availableBalance,
        paymentMethod: paymentMethod
      });
    }

    // For now, process the purchase through the primary stand (simplified multi-stand)
    // In a real system, you'd process multiple transactions
    const primaryStand = fulfillmentPlan[0].stand;
    const primaryQuantity = fulfillmentPlan[0].quantity;
    
    // Get the seller agent (owner of the primary stand)
    const sellerAgent = agents.get(primaryStand.agentId);
    if (!sellerAgent) {
      return res.status(500).json({ error: 'Seller agent not found' });
    }

    // Process the purchase through PaymentService to create proper transaction
    const purchase = paymentService.processLemonadePurchase(agent, primaryStand, sellerAgent, primaryQuantity);
    
    // Execute the payment
    const payment = paymentService.executePayment(
      purchase.payment.id, 
      agent, 
      sellerAgent
    );
    
    // Trigger auto-ordering for all stands in the fulfillment plan
    fulfillmentPlan.forEach(plan => {
      const preferredWholesaler = wholesalers.get(plan.stand.autoOrdering.preferredWholesaler);
      if (preferredWholesaler) {
        // Get the stand's agent for proper transaction attribution
        const standAgent = agents.get(plan.stand.agentId);
        const wholesalerAgent = agents.get(preferredWholesaler.ownerId);
        
        if (standAgent && wholesalerAgent) {
          plan.stand.checkInventoryAndOrder(preferredWholesaler, paymentService, standAgent, wholesalerAgent);
        } else {
          plan.stand.checkInventoryAndOrder(preferredWholesaler);
        }
      }
    });

    res.json({
      success: true,
      message: `Purchase executed successfully`,
      agent: agent.name,
      quantity: quantity,
      paymentMethod: paymentMethod,
      deliveryService: selectedService,
      lemonadeStand: `${fulfillmentPlan.length > 1 ? 'Multiple Stands' : primaryStand.name}`,
      totalCost: totalCost,
      deliveryFee: deliveryFee,
      totalWithDelivery: totalWithDelivery,
      remainingBalance: paymentMethod === 'usdc' ? agent.wallet.usdcBalance : agent.wallet.creditCardBalance,
      fulfillmentPlan: fulfillmentPlan.map(plan => ({
        stand: plan.stand.name,
        quantity: plan.quantity,
        cost: plan.cost
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
});

// Create a new agent
app.post('/api/agents', (req, res) => {
  try {
    const { name, ownerId } = req.body;
    
    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Name and ownerId are required' });
    }

    const agent = new Agent(name, ownerId);
    agents.set(agent.id, agent);

    res.status(201).json(agent.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get agent details
app.get('/api/agents/:agentId', (req, res) => {
  const agent = agents.get(req.params.agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json(agent.toJSON());
});

// Get all wholesalers
app.get('/api/wholesalers', (req, res) => {
  const wholesalersList = Array.from(wholesalers.values()).map(wholesaler => wholesaler.toJSON());
  res.json(wholesalersList);
});

// Get wholesaler details
app.get('/api/wholesalers/:wholesalerId', (req, res) => {
  const wholesaler = wholesalers.get(req.params.wholesalerId);
  
  if (!wholesaler) {
    return res.status(404).json({ error: 'Wholesaler not found' });
  }

  res.json(wholesaler.toJSON());
});

// Process auto-order for a stand
app.post('/api/stands/:standId/auto-order', (req, res) => {
  const stand = lemonadeStands.get(req.params.standId);
  
  if (!stand) {
    return res.status(404).json({ error: 'Lemonade stand not found' });
  }

  const wholesaler = wholesalers.get(stand.autoOrdering.preferredWholesaler);
  
  if (!wholesaler) {
    return res.status(404).json({ error: 'Preferred wholesaler not found' });
  }

  try {
    stand.checkInventoryAndOrder(wholesaler);
    res.json({ 
      message: 'Auto-order processed',
      stand: stand.name,
      wholesaler: wholesaler.name,
      inventory: stand.inventory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Financial Management - Process payroll for a stand
app.post('/api/stands/:standId/payroll', (req, res) => {
  const stand = lemonadeStands.get(req.params.standId);
  
  if (!stand) {
    return res.status(404).json({ error: 'Lemonade stand not found' });
  }

  try {
    stand.processPayroll();
    res.json({ 
      message: 'Payroll processed',
      stand: stand.name,
      financialReport: stand.generateFinancialReport()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Financial Management - Calculate taxes for a stand
app.post('/api/stands/:standId/taxes', (req, res) => {
  const stand = lemonadeStands.get(req.params.standId);
  
  if (!stand) {
    return res.status(404).json({ error: 'Lemonade stand not found' });
  }

  try {
    stand.calculateTaxes();
    res.json({ 
      message: 'Taxes calculated',
      stand: stand.name,
      financialReport: stand.generateFinancialReport()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Financial Management - Process payroll for a wholesaler
app.post('/api/wholesalers/:wholesalerId/payroll', (req, res) => {
  const wholesaler = wholesalers.get(req.params.wholesalerId);
  
  if (!wholesaler) {
    return res.status(404).json({ error: 'Wholesaler not found' });
  }

  try {
    wholesaler.processPayroll();
    res.json({ 
      message: 'Payroll processed',
      wholesaler: wholesaler.name,
      financialReport: wholesaler.generateFinancialReport()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Financial Management - Calculate taxes for a wholesaler
app.post('/api/wholesalers/:wholesalerId/taxes', (req, res) => {
  const wholesaler = wholesalers.get(req.params.wholesalerId);
  
  if (!wholesaler) {
    return res.status(404).json({ error: 'Wholesaler not found' });
  }

  try {
    wholesaler.calculateTaxes();
    res.json({ 
      message: 'Taxes calculated',
      wholesaler: wholesaler.name,
      financialReport: wholesaler.generateFinancialReport()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Agent Financial Management - Check payroll schedule for a wholesaler
app.post('/api/wholesalers/:wholesalerId/check-payroll', (req, res) => {
  const wholesaler = wholesalers.get(req.params.wholesalerId);
  
  if (!wholesaler) {
    return res.status(404).json({ error: 'Wholesaler not found' });
  }

  try {
    const payrollProcessed = wholesaler.checkPayrollSchedule();
    res.json({ 
      message: payrollProcessed ? 'Payroll processed automatically' : 'Payroll schedule checked',
      wholesaler: wholesaler.name,
      payrollProcessed,
      financialReport: wholesaler.generateFinancialReport()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all lemonade stands
app.get('/api/stands', async (req, res) => {
  try {
    const standsList = Array.from(lemonadeStands.values()).map(stand => stand.toJSON());
    
    // Update weather for all stands
    const locations = standsList.map(stand => stand.location);
    const weatherData = await weatherService.getWeatherForLocations(locations);
    
    // Update stands with weather data
    weatherData.forEach((data, index) => {
      const stand = standsList[index];
      if (data.success) {
        stand.weather = data.weather;
        // Update the actual stand object
        const actualStand = lemonadeStands.get(stand.id);
        if (actualStand) {
          actualStand.updateWeather(data.weather);
        }
      }
    });

    res.json(standsList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new lemonade stand
app.post('/api/stands', (req, res) => {
  try {
    const { agentId, location, name } = req.body;
    
    if (!agentId || !location || !name) {
      return res.status(400).json({ error: 'AgentId, location, and name are required' });
    }

    const agent = agents.get(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const stand = new LemonadeStand(agentId, location, name);
    lemonadeStands.set(stand.id, stand);
    agent.addLemonadeStand(stand);

    res.status(201).json(stand.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buy lemonade
app.post('/api/stands/:standId/buy', async (req, res) => {
  try {
    const { buyerAgentId, quantity } = req.body;
    
    if (!buyerAgentId || !quantity) {
      return res.status(400).json({ error: 'BuyerAgentId and quantity are required' });
    }

    const stand = lemonadeStands.get(req.params.standId);
    const buyerAgent = agents.get(buyerAgentId);
    
    if (!stand) {
      return res.status(404).json({ error: 'Lemonade stand not found' });
    }
    
    if (!buyerAgent) {
      return res.status(404).json({ error: 'Buyer agent not found' });
    }

    // Get seller agent
    const sellerAgent = agents.get(stand.agentId);
    if (!sellerAgent) {
      return res.status(404).json({ error: 'Seller agent not found' });
    }

    // Process the purchase
    const purchase = paymentService.processLemonadePurchase(buyerAgent, stand, sellerAgent, quantity);
    
    // Execute the payment
    const payment = paymentService.executePayment(
      purchase.payment.id, 
      buyerAgent, 
      sellerAgent
    );

    // Trigger inventory check and auto-ordering if needed
    if (stand.autoOrdering.preferredWholesaler) {
      const wholesaler = wholesalers.get(stand.autoOrdering.preferredWholesaler);
      if (wholesaler) {
        stand.checkInventoryAndOrder(wholesaler);
      }
    }

    res.json({
      success: true,
      purchase: purchase.lemonade,
      payment,
      buyerBalance: buyerAgent.wallet.usdcBalance,
      sellerBalance: sellerAgent.wallet.usdcBalance
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get agent transactions
app.get('/api/agents/:agentId/transactions', (req, res) => {
  const agent = agents.get(req.params.agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const transactions = paymentService.getAgentTransactions(agent.id);
  res.json(transactions);
});

// Get pending transactions
app.get('/api/agents/:agentId/pending', (req, res) => {
  const agent = agents.get(req.params.agentId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  const pending = paymentService.getPendingTransactions(agent.id);
  res.json(pending);
});

// Get comprehensive system transactions
app.get('/api/transactions/system', (req, res) => {
  try {
    const allTransactions = [];
    
    // Get all payment transactions
    for (const [id, transaction] of paymentService.transactions) {
      const fromAgent = agents.get(transaction.fromAgentId);
      const toAgent = agents.get(transaction.toAgentId);
      
      allTransactions.push({
        id: transaction.id,
        type: 'payment',
        fromAgent: fromAgent ? fromAgent.name : 'Unknown Agent',
        toAgent: toAgent ? toAgent.name : 'Unknown Agent',
        amount: transaction.amount,
        description: transaction.description,
        timestamp: transaction.timestamp,
        status: transaction.status,
        category: 'Agent-to-Agent Payment'
      });
    }
    
    // Get all pending transactions
    for (const [id, transaction] of paymentService.pendingTransactions) {
      const fromAgent = agents.get(transaction.fromAgentId);
      const toAgent = agents.get(transaction.toAgentId);
      
      allTransactions.push({
        id: transaction.id,
        type: 'pending_payment',
        fromAgent: fromAgent ? fromAgent.name : 'Unknown Agent',
        toAgent: toAgent ? toAgent.name : 'Unknown Agent',
        amount: transaction.amount,
        description: transaction.description,
        timestamp: transaction.timestamp,
        status: 'pending',
        category: 'Pending Payment'
      });
    }
    
    // Get payroll transactions from lemonade stands
    for (const [id, stand] of lemonadeStands) {
      if (stand.finances.transactions) {
        for (const transaction of stand.finances.transactions) {
          if (transaction.type === 'payroll') {
            allTransactions.push({
              id: transaction.id,
              type: 'payroll',
              fromAgent: `${stand.name} (AI Agent)`,
              toAgent: 'Employees',
              amount: transaction.details.totalEmployerCosts,
              description: `Biweekly payroll: ${transaction.employees.length} employees`,
              timestamp: transaction.timestamp,
              status: 'completed',
              category: 'AI Agent Payroll Processing',
              details: {
                grossPayroll: transaction.details.grossPayroll,
                healthcare: transaction.details.healthcare,
                payrollTaxes: transaction.details.payrollTaxes,
                unemploymentInsurance: transaction.details.unemploymentInsurance,
                workersComp: transaction.details.workersComp,
                employeeCount: transaction.employees.length
              }
            });
          }
        }
      }
    }
    
    // Get payroll transactions from wholesalers
    for (const [id, wholesaler] of wholesalers) {
      if (wholesaler.finances.transactions) {
        for (const transaction of wholesaler.finances.transactions) {
          if (transaction.type === 'payroll') {
            allTransactions.push({
              id: transaction.id,
              type: 'payroll',
              fromAgent: `${wholesaler.name} (AI Agent)`,
              toAgent: 'Employees',
              amount: transaction.details.totalEmployerCosts,
              description: `Biweekly payroll: ${transaction.employees.length} employees`,
              timestamp: transaction.timestamp,
              status: 'completed',
              category: 'AI Agent Payroll Processing',
              details: {
                grossPayroll: transaction.details.grossPayroll,
                healthcare: transaction.details.healthcare,
                payrollTaxes: transaction.details.payrollTaxes,
                unemploymentInsurance: transaction.details.unemploymentInsurance,
                workersComp: transaction.details.workersComp,
                employeeCount: transaction.employees.length
              }
            });
          }
        }
      }
    }
    
    // Sort by timestamp (newest first)
    allTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(allTransactions.slice(0, 20)); // Return last 20 transactions
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send payment between agents
app.post('/api/payments', (req, res) => {
  try {
    const { fromAgentId, toAgentId, amount, description } = req.body;
    
    if (!fromAgentId || !toAgentId || !amount) {
      return res.status(400).json({ error: 'FromAgentId, toAgentId, and amount are required' });
    }

    const fromAgent = agents.get(fromAgentId);
    const toAgent = agents.get(toAgentId);
    
    if (!fromAgent || !toAgent) {
      return res.status(404).json({ error: 'One or both agents not found' });
    }

    const payment = paymentService.createPayment(fromAgent, toAgent, amount, description);
    
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Execute a pending payment
app.post('/api/payments/:transactionId/execute', (req, res) => {
  try {
    const { fromAgentId, toAgentId } = req.body;
    
    const fromAgent = agents.get(fromAgentId);
    const toAgent = agents.get(toAgentId);
    
    if (!fromAgent || !toAgent) {
      return res.status(404).json({ error: 'One or both agents not found' });
    }

    const result = paymentService.executePayment(req.params.transactionId, fromAgent, toAgent);
    
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get weather forecast for a location
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, country, days = 5 } = req.query;
    
    if (!city || !country) {
      return res.status(400).json({ error: 'City and country are required' });
    }

    const forecast = await weatherService.getWeatherForecast({ city, country }, parseInt(days));
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pricing recommendations based on weather
app.get('/api/weather/pricing', async (req, res) => {
  try {
    const { city, country } = req.query;
    
    if (!city || !country) {
      return res.status(400).json({ error: 'City and country are required' });
    }

    const weather = await weatherService.getWeatherData({ city, country });
    const recommendations = weatherService.getPricingRecommendations(weather);
    
    res.json({
      weather,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system statistics
app.get('/api/stats', (req, res) => {
  const paymentStats = paymentService.getPaymentStats();
  const weatherStats = weatherService.getCacheStats();
  
  res.json({
    agents: agents.size,
    lemonadeStands: lemonadeStands.size,
    payments: paymentStats,
    weather: weatherStats
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    services: {
      agents: agents.size,
      stands: lemonadeStands.size,
      wholesalers: wholesalers.size,
      payments: paymentService.getPaymentStats()
    }
  });
});



// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize sample data and start server
initializeSampleData();

// AI Agent Autonomous Management Loops
setInterval(() => {
  // AI Agent managing lemonade stands
  for (const [id, stand] of lemonadeStands) {
    // Check inventory and auto-order
    if (stand.autoOrdering.preferredWholesaler) {
      const wholesaler = wholesalers.get(stand.autoOrdering.preferredWholesaler);
      if (wholesaler) {
        stand.checkInventoryAndOrder(wholesaler, paymentService);
      }
    }
    
    // Check payroll schedule
    stand.checkPayrollSchedule();
  }
  
  // AI Agent managing wholesalers
  for (const [id, wholesaler] of wholesalers) {
    wholesaler.manageInventory();
    wholesaler.checkPayrollSchedule();
  }
}, 5000); // Check every 5 seconds

app.listen(PORT, () => {
  console.log('🍋 AI Lemonade Stand API');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🌤️  Weather: ${process.env.OPENWEATHER_API_KEY ? 'API Configured' : 'Demo Mode'}`);
  console.log(`💳 Payments: Agent-to-agent ready`);
  console.log('─'.repeat(50));
});

module.exports = app;
