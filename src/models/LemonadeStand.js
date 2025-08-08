const { v4: uuidv4 } = require('uuid');

class LemonadeStand {
  constructor(agentId, location, name) {
    this.id = uuidv4();
    this.agentId = agentId;
    this.location = location;
    this.name = name;
    this.inventory = {
      inventory: {
        lemons: 100,
        sugar: 50,
        cups: 200,
        ice: 100
      },
      lemonade: 0, // Ready-to-sell lemonade cups
      lemonToLemonadeRatio: 2, // 2 lemons = 1 cup of lemonade
      maxLemonadeCapacity: 50 // Maximum lemonade cups that can be stored
    };
    this.pricing = {
      basePrice: 2.50,
      weatherMultiplier: 1.0,
      demandMultiplier: 1.0,
      supplyMultiplier: 1.0,
      currentPrice: 2.50
    };
    this.sales = {
      totalSold: 0,
      revenue: 0,
      transactions: [],
      recentSales: [] // Track recent sales for demand analysis
    };
    this.weather = {
      temperature: 20,
      condition: 'sunny',
      lastUpdated: new Date()
    };
    this.isOpen = true;
    this.createdAt = new Date();
    this.autoOrdering = {
      enabled: true,
      lemonThreshold: 10, // More aggressive - order when down to 10 lemons
      sugarThreshold: 5, // More aggressive
      cupThreshold: 25, // More aggressive
      iceThreshold: 10, // More aggressive
      lemonadeThreshold: 25, // Maintain 25+ cups of lemonade (more aggressive)
      maxLemonadeTarget: 75, // Target 75 cups maximum
      emergencyThreshold: 5, // Emergency order when lemonade drops to 5 cups
      preferredWholesaler: null
    };
    this.marketDynamics = {
      demandLevel: 1.0,
      supplyLevel: 1.0,
      lastDemandUpdate: new Date(),
      lastSupplyUpdate: new Date()
    };
    
    // AI Agent Financial Management
    this.finances = {
      revenue: 0,
      expenses: 0,
      costOfGoodsSold: 0, // Cost of lemons, sugar, cups, ice
      grossProfit: 0,
      operatingExpenses: 0,
      netProfit: 0,
      taxes: 0,
      healthcare: 0,
      payroll: 0,
      cashFlow: []
    };
    
    this.employees = [
      { id: 'emp1', name: 'Alex Johnson', position: 'Stand Manager', salary: 2800, healthcare: 400 },
      { id: 'emp2', name: 'Sarah Chen', position: 'Cashier', salary: 2200, healthcare: 350 },
      { id: 'emp3', name: 'Mike Rodriguez', position: 'Prep Cook', salary: 2400, healthcare: 380 }
    ];
    
    // AI Agent Payroll Management
    this.payrollSchedule = {
      frequency: 'biweekly', // biweekly payroll
      lastPayrollDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      nextPayrollDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      autoProcess: true,
      payrollHistory: []
    };
  }

  updateWeather(weatherData) {
    this.weather = {
      temperature: weatherData.temperature,
      condition: weatherData.condition,
      lastUpdated: new Date()
    };
    
    this.calculateWeatherPricing();
  }

  calculateWeatherPricing() {
    let multiplier = 1.0;
    
    // Temperature effects
    if (this.weather.temperature > 30) {
      multiplier = 1.5; // Hot weather = higher demand
    } else if (this.weather.temperature > 25) {
      multiplier = 1.3;
    } else if (this.weather.temperature > 20) {
      multiplier = 1.1;
    } else if (this.weather.temperature < 10) {
      multiplier = 0.5; // Cold weather = lower demand
    } else if (this.weather.temperature < 15) {
      multiplier = 0.7;
    }

    // Weather condition effects
    switch (this.weather.condition) {
      case 'sunny':
        multiplier *= 1.2;
        break;
      case 'cloudy':
        multiplier *= 0.9;
        break;
      case 'rainy':
        multiplier *= 0.6;
        break;
      case 'stormy':
        multiplier *= 0.3;
        break;
    }

    this.pricing.weatherMultiplier = multiplier;
    this.calculateMarketPricing();
  }

  calculateMarketPricing() {
    // Calculate final price based on weather, demand, and supply
    const basePrice = this.pricing.basePrice;
    const weatherMultiplier = this.pricing.weatherMultiplier;
    const demandMultiplier = this.pricing.demandMultiplier;
    const supplyMultiplier = this.pricing.supplyMultiplier;
    
    this.pricing.currentPrice = Math.round((basePrice * weatherMultiplier * demandMultiplier * supplyMultiplier) * 100) / 100;
  }

  updateDemandLevel() {
    const now = new Date();
    const timeWindow = 5 * 60 * 1000; // 5 minutes
    const recentSales = this.sales.recentSales.filter(sale => 
      now - new Date(sale.timestamp) < timeWindow
    );

    if (recentSales.length > 0) {
      const totalQuantity = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
      const avgQuantity = totalQuantity / recentSales.length;
      
      // Adjust demand based on recent sales volume
      if (avgQuantity > 3) {
        this.marketDynamics.demandLevel = Math.min(2.0, this.marketDynamics.demandLevel + 0.1);
      } else if (avgQuantity < 1) {
        this.marketDynamics.demandLevel = Math.max(0.5, this.marketDynamics.demandLevel - 0.1);
      }
      
      this.pricing.demandMultiplier = this.marketDynamics.demandLevel;
      this.marketDynamics.lastDemandUpdate = now;
    }
  }

  updateSupplyLevel() {
    const totalInventory = this.inventory.lemons + this.inventory.sugar + this.inventory.cups + this.inventory.ice;
    const maxInventory = 100 + 50 + 200 + 100; // Initial inventory levels
    const inventoryRatio = totalInventory / maxInventory;
    
    // Adjust supply multiplier based on inventory levels
    if (inventoryRatio < 0.3) {
      this.marketDynamics.supplyLevel = Math.max(0.5, this.marketDynamics.supplyLevel - 0.1);
    } else if (inventoryRatio > 0.8) {
      this.marketDynamics.supplyLevel = Math.min(1.5, this.marketDynamics.supplyLevel + 0.1);
    }
    
    this.pricing.supplyMultiplier = this.marketDynamics.supplyLevel;
    this.marketDynamics.lastSupplyUpdate = new Date();
  }

  // Intelligent purchasing logic based on stand quality and wholesaler pricing
  calculateOptimalLemonOrder(wholesaler) {
    if (!wholesaler || !wholesaler.pricingFactors) {
      return 50; // Default order size
    }

    // Determine optimal order quantity based on stand quality and wholesaler pricing
    const baseOrderSize = 50;
    let optimalQuantity = baseOrderSize;

    // Quality-based ordering strategy
    switch (this.name) {
      case 'La Jolla Lemonade':
        // Premium stand - prioritize quality over cost
        if (wholesaler.quality === 'premium') {
          optimalQuantity = 75; // Larger orders for premium quality
          console.log(`🎯 Premium stand ${this.name} ordering premium lemons in bulk (${optimalQuantity})`);
        } else {
          optimalQuantity = 60; // Still order more for quality
        }
        break;
      
      case 'Gaslamp Quarter Lemonade':
        // Mid-tier stand - balance quality and cost
        if (wholesaler.quality === 'standard' || wholesaler.quality === 'premium') {
          optimalQuantity = 65; // Good balance
        } else {
          optimalQuantity = 55; // Slightly less for budget wholesalers
        }
        break;
      
      case 'Coronado Beach Lemonade':
        // Budget stand - prioritize cost efficiency
        if (wholesaler.quality === 'budget') {
          optimalQuantity = 80; // Large orders for volume discounts
          console.log(`💰 Budget stand ${this.name} maximizing volume discounts (${optimalQuantity})`);
        } else {
          optimalQuantity = 45; // Smaller orders for premium wholesalers
        }
        break;
    }

    // Apply volume discount optimization
    if (wholesaler.pricingFactors && wholesaler.pricingFactors.volumeDiscounts) {
      const thresholds = Object.keys(wholesaler.pricingFactors.volumeDiscounts).map(Number).sort((a, b) => a - b);
      
      for (const threshold of thresholds) {
        if (optimalQuantity >= threshold) {
          // Already at or above threshold, good
          break;
        } else if (threshold - optimalQuantity <= 20) {
          // Close to next threshold, bump up for discount
          optimalQuantity = threshold;
          console.log(`📈 ${this.name} bumped order to ${optimalQuantity} for volume discount`);
          break;
        }
      }
    }

    return optimalQuantity;
  }

  // Evaluate wholesaler suitability based on stand quality and pricing
  evaluateWholesalerSuitability(wholesaler) {
    if (!wholesaler || !wholesaler.pricingFactors) {
      return { suitable: true, score: 0.5, reason: 'No pricing factors available' };
    }

    let score = 0;
    let reasons = [];

    // Quality alignment scoring
    const qualityAlignment = {
      'La Jolla Lemonade': { premium: 1.0, standard: 0.6, budget: 0.3 },
      'Gaslamp Quarter Lemonade': { premium: 0.8, standard: 1.0, budget: 0.7 },
      'Coronado Beach Lemonade': { premium: 0.4, standard: 0.7, budget: 1.0 }
    };

    const alignment = qualityAlignment[this.name]?.[wholesaler.quality] || 0.5;
    score += alignment * 0.4; // 40% weight for quality alignment
    reasons.push(`${wholesaler.quality} quality: ${Math.round(alignment * 100)}% match`);

    // Price competitiveness scoring
    const basePrice = wholesaler.pricingFactors.basePrice;
    const priceScore = Math.max(0, 1 - (basePrice - 0.25) / 0.25); // Lower price = higher score
    score += priceScore * 0.3; // 30% weight for price
    reasons.push(`Price competitiveness: ${Math.round(priceScore * 100)}%`);

    // Reliability scoring
    const reliabilityScore = wholesaler.pricingFactors.reliabilityScore || 0.9;
    score += reliabilityScore * 0.2; // 20% weight for reliability
    reasons.push(`Reliability: ${Math.round(reliabilityScore * 100)}%`);

    // Value-added services scoring
    const services = wholesaler.pricingFactors.valueAddedServices;
    let servicesScore = 0.5; // Base score
    if (services.washing) servicesScore += 0.1;
    if (services.sorting) servicesScore += 0.1;
    if (services.packaging === 'premium') servicesScore += 0.2;
    if (services.coldStorage) servicesScore += 0.1;
    score += Math.min(servicesScore, 1.0) * 0.1; // 10% weight for services
    reasons.push(`Value-added services: ${Math.round(servicesScore * 100)}%`);

    const suitable = score >= 0.6; // Minimum 60% score to be suitable

    return {
      suitable,
      score: Math.round(score * 100) / 100,
      reason: reasons.join(', ')
    };
  }

  canMakeLemonade(quantity = 1) {
    return this.inventory.inventory.lemons >= quantity * this.inventory.lemonToLemonadeRatio &&
           this.inventory.inventory.sugar >= quantity * 1 &&
           this.inventory.inventory.cups >= quantity &&
           this.inventory.inventory.ice >= quantity * 2;
  }

  makeLemonade(quantity = 1) {
    if (!this.canMakeLemonade(quantity)) {
      throw new Error('Not enough ingredients to make lemonade');
    }

    // Use ingredients to make lemonade
    this.inventory.inventory.lemons -= quantity * this.inventory.lemonToLemonadeRatio;
    this.inventory.inventory.sugar -= quantity * 1;
    this.inventory.inventory.cups -= quantity;
    this.inventory.inventory.ice -= quantity * 2;

    // Add to ready-to-sell lemonade
    this.inventory.lemonade += quantity;

    return {
      quantity,
      price: this.pricing.currentPrice * quantity,
      ingredients: {
        lemons: quantity * this.inventory.lemonToLemonadeRatio,
        sugar: quantity * 1,
        cups: quantity,
        ice: quantity * 2
      }
    };
  }

  sellLemonade(quantity, buyerAgentId) {
    if (!this.isOpen) {
      throw new Error('Lemonade stand is closed');
    }

    // Check if we have enough ready-to-sell lemonade
    if (this.inventory.lemonade < quantity) {
      // Try to make more lemonade if we have ingredients
      const canMake = Math.min(
        Math.floor(this.inventory.inventory.lemons / this.inventory.lemonToLemonadeRatio),
        Math.floor(this.inventory.inventory.sugar / 1),
        Math.floor(this.inventory.inventory.cups / 1),
        Math.floor(this.inventory.inventory.ice / 2),
        this.inventory.maxLemonadeCapacity - this.inventory.lemonade
      );
      
      if (canMake > 0) {
        this.makeLemonade(canMake);
      }
      
      // Check again if we have enough after making more
      if (this.inventory.lemonade < quantity) {
        // La Jolla is proactive - immediately order supplies to fulfill the order
        if (this.name.toLowerCase().includes('la jolla')) {
          console.log(`🚨 La Jolla can't fulfill ${quantity} cups (only ${this.inventory.lemonade} available) - immediately ordering supplies!`);
          
          // Trigger emergency ordering - this will be handled by the calling code
          console.log(`🎯 La Jolla requesting emergency supply order to fulfill premium customer demand`);
        }
        
        throw new Error(`Not enough lemonade available. Only ${this.inventory.lemonade} cups ready, ${quantity} requested.`);
      }
    }

    // Sell the lemonade
    this.inventory.lemonade -= quantity;
    const totalPrice = this.pricing.currentPrice * quantity;

    // Calculate cost of goods sold (lemons, sugar, cups, ice)
    const costPerCup = (2 * 0.5) + (1 * 0.3) + (1 * 0.1) + (2 * 0.2); // 2 lemons + 1 sugar + 1 cup + 2 ice
    const costOfGoodsSold = quantity * costPerCup;
    
    // Update financial records
    this.finances.revenue += totalPrice;
    this.finances.costOfGoodsSold += costOfGoodsSold;
    this.finances.expenses = this.finances.costOfGoodsSold; // Track expenses as cost of goods sold
    this.finances.grossProfit = this.finances.revenue - this.finances.costOfGoodsSold;
    
    // Update financial calculations
    this.updateFinances();
    
    // Record the sale
    this.sales.totalSold += quantity;
    this.sales.revenue += totalPrice;
    
    const transaction = {
      id: uuidv4(),
      buyerAgentId,
      quantity,
      price: this.pricing.currentPrice,
      totalPrice,
      timestamp: new Date(),
      weather: { ...this.weather }
    };
    
    this.sales.transactions.push(transaction);
    this.sales.recentSales.push({
      quantity,
      timestamp: new Date()
    });

    // Update market dynamics
    this.updateDemandLevel();
    this.updateSupplyLevel();
    this.calculateMarketPricing();

    // Check if inventory is running low and trigger auto-ordering
    this.checkInventoryAndOrder(null); // Will be called with wholesaler from outside

    return {
      transactionId: transaction.id,
      quantity,
      price: this.pricing.currentPrice,
      totalPrice,
      weather: this.weather
    };
  }

  restock(ingredients) {
    const costs = {
      lemons: ingredients.lemons * 0.5,
      sugar: ingredients.sugar * 0.3,
      cups: ingredients.cups * 0.1,
      ice: ingredients.ice * 0.2
    };

    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

    this.inventory.inventory.lemons += ingredients.lemons || 0;
    this.inventory.inventory.sugar += ingredients.sugar || 0;
    this.inventory.inventory.cups += ingredients.cups || 0;
    this.inventory.inventory.ice += ingredients.ice || 0;

    return {
      ingredients,
      costs,
      totalCost
    };
  }

  getInventoryStatus() {
    const lowStock = [];
    if (this.inventory.inventory.lemons < 20) lowStock.push('lemons');
    if (this.inventory.inventory.sugar < 10) lowStock.push('sugar');
    if (this.inventory.inventory.cups < 50) lowStock.push('cups');
    if (this.inventory.inventory.ice < 20) lowStock.push('ice');

    return {
      lemons: this.inventory.inventory.lemons,
      sugar: this.inventory.inventory.sugar,
      cups: this.inventory.inventory.cups,
      ice: this.inventory.inventory.ice,
      lemonade: this.inventory.lemonade,
      lowStock,
      canMake: this.canMakeLemonade(1)
    };
  }

  getSalesAnalytics() {
    const today = new Date();
    const todaySales = this.sales.transactions.filter(t => 
      t.timestamp.toDateString() === today.toDateString()
    );

    return {
      totalSold: this.sales.totalSold,
      totalRevenue: this.sales.revenue,
      todaySold: todaySales.length,
      todayRevenue: todaySales.reduce((sum, t) => sum + t.totalPrice, 0),
      averagePrice: this.sales.totalSold > 0 ? this.sales.revenue / this.sales.totalSold : 0
    };
  }

  // AI Agent managing inventory and auto-ordering
  checkInventoryAndOrder(wholesaler, paymentService = null, standAgent = null, wholesalerAgent = null, isLargeOrder = false) {
    if (!this.autoOrdering.enabled) return;

    const needsOrder = [];
    let isEmergencyOrder = false;
    
    // Emergency check - if lemonade is critically low, order immediately
    if (this.inventory.lemonade <= this.autoOrdering.emergencyThreshold) {
      console.log(`🚨 EMERGENCY: ${this.name} is critically low on lemonade (${this.inventory.lemonade} cups)!`);
      isEmergencyOrder = true;
      needsOrder.push({ item: 'lemons', quantity: 100, current: this.inventory.inventory.lemons }); // Double order
      needsOrder.push({ item: 'sugar', quantity: 50, current: this.inventory.inventory.sugar });
      needsOrder.push({ item: 'cups', quantity: 200, current: this.inventory.inventory.cups });
      needsOrder.push({ item: 'ice', quantity: 100, current: this.inventory.inventory.ice });
    } else if (isLargeOrder) {
      // Large order detected - order aggressively to meet demand
      console.log(`🚨 EMERGENCY ${this.name}: Ordering supplies for large order...`);
      isEmergencyOrder = true;
      needsOrder.push({ item: 'lemons', quantity: 150, current: this.inventory.inventory.lemons }); // Triple order
      needsOrder.push({ item: 'sugar', quantity: 75, current: this.inventory.inventory.sugar });
      needsOrder.push({ item: 'cups', quantity: 300, current: this.inventory.inventory.cups });
      needsOrder.push({ item: 'ice', quantity: 150, current: this.inventory.inventory.ice });
    } else {
      // Regular inventory checks with intelligent ordering
      if (this.inventory.inventory.lemons <= this.autoOrdering.lemonThreshold) {
        const optimalQuantity = this.calculateOptimalLemonOrder(wholesaler);
        needsOrder.push({ item: 'lemons', quantity: optimalQuantity, current: this.inventory.inventory.lemons });
      }
      if (this.inventory.inventory.sugar <= this.autoOrdering.sugarThreshold) {
        needsOrder.push({ item: 'sugar', quantity: 25, current: this.inventory.inventory.sugar });
      }
      if (this.inventory.inventory.cups <= this.autoOrdering.cupThreshold) {
        needsOrder.push({ item: 'cups', quantity: 100, current: this.inventory.inventory.cups });
      }
      if (this.inventory.inventory.ice <= this.autoOrdering.iceThreshold) {
        needsOrder.push({ item: 'ice', quantity: 50, current: this.inventory.inventory.ice });
      }
    }

    // Check if we need to make more lemonade
    if (this.inventory.lemonade <= this.autoOrdering.lemonadeThreshold) {
      console.log(`🍋 AI Agent: ${this.name} is low on lemonade (${this.inventory.lemonade} cups). Making more...`);
      
      // Calculate how much lemonade we can make
      const canMake = Math.min(
        Math.floor(this.inventory.inventory.lemons / this.inventory.lemonToLemonadeRatio),
        Math.floor(this.inventory.inventory.sugar / 1),
        Math.floor(this.inventory.inventory.cups / 1),
        Math.floor(this.inventory.inventory.ice / 2),
        this.inventory.maxLemonadeCapacity - this.inventory.lemonade,
        this.autoOrdering.maxLemonadeTarget - this.inventory.lemonade // Don't exceed target
      );
      
      if (canMake > 0) {
        try {
          this.makeLemonade(canMake);
          console.log(`✅ AI Agent: ${this.name} made ${canMake} cups of lemonade. Total: ${this.inventory.lemonade} cups`);
        } catch (error) {
          console.log(`❌ AI Agent: Failed to make lemonade - ${error.message}`);
        }
      } else {
        console.log(`⚠️ AI Agent: ${this.name} needs more ingredients to make lemonade`);
      }
    }

    if (needsOrder.length > 0 && wholesaler) {
      const orderType = isEmergencyOrder ? '🚨 EMERGENCY' : '📦 Auto';
      console.log(`${orderType} ${this.name}: Ordering supplies...`);
      this.processAutoOrder(wholesaler, needsOrder, isEmergencyOrder, paymentService, standAgent, wholesalerAgent);
    }
  }

  processAutoOrder(wholesaler, orderItems, isEmergencyOrder = false, paymentService = null, standAgent = null, wholesalerAgent = null) {
    let totalCost = 0;
    const orderDetails = [];

    orderItems.forEach(item => {
      let itemCost = 0;
      if (item.item === 'lemons') {
        // Use dynamic pricing based on quantity and quality
        const pricePerLemon = wholesaler.calculateLemonPrice(item.quantity);
        itemCost = item.quantity * pricePerLemon;
        totalCost += itemCost;
        
        // Evaluate wholesaler suitability for this stand
        const suitability = this.evaluateWholesalerSuitability(wholesaler);
        console.log(`🎯 ${this.name} evaluating ${wholesaler.name}: ${suitability.score * 100}% suitability (${suitability.reason})`);
        
        orderDetails.push({
          item: item.item,
          quantity: item.quantity,
          cost: itemCost,
          pricePerUnit: pricePerLemon,
          quality: wholesaler.quality,
          certification: wholesaler.pricingFactors?.certification || 'Standard',
          suitabilityScore: suitability.score
        });
      } else {
        // Simulate costs for other items
        const prices = { sugar: 0.3, cups: 0.1, ice: 0.2 };
        itemCost = item.quantity * prices[item.item];
        totalCost += itemCost;
        orderDetails.push({
          item: item.item,
          quantity: item.quantity,
          cost: itemCost,
          pricePerUnit: prices[item.item]
        });
      }
    });

    // Track expenses in financial records
    this.finances.expenses += totalCost;
    this.updateFinances();

    // Create PaymentService transaction if agents are provided
    if (paymentService && standAgent && wholesalerAgent) {
      try {
        const supplyOrder = paymentService.createPayment(
          standAgent,
          wholesalerAgent,
          totalCost,
          `Supply order: ${orderItems.map(item => `${item.quantity} ${item.item}`).join(', ')} from ${wholesaler.name}`
        );
        
        const executedPayment = paymentService.executePayment(
          supplyOrder.id,
          standAgent,
          wholesalerAgent
        );
        
        console.log(`💳 AI Agent Transaction: ${standAgent.name} → ${wholesalerAgent.name}: $${totalCost.toFixed(2)} USDC`);
      } catch (error) {
        console.log(`❌ AI Agent: Failed to create payment transaction - ${error.message}`);
      }
    }

    const orderType = isEmergencyOrder ? '🚨 EMERGENCY' : '📦 Auto';
    console.log(`${orderType} ${this.name} → ${wholesaler.name}: $${totalCost.toFixed(2)}`);
    console.log(`   💰 ${this.name}: Revenue $${this.finances.revenue.toFixed(2)} | Expenses $${this.finances.expenses.toFixed(2)} | Net $${this.finances.netProfit.toFixed(2)}`);

    // Process the order through the wholesaler to track revenue
    orderDetails.forEach(detail => {
      if (detail.item === 'lemons') {
        try {
          wholesaler.processOrder(this.id, detail.quantity, this.name);
        } catch (error) {
          console.log(`❌ AI Agent: Failed to process lemon order - ${error.message}`);
        }
      }
    });

    // Simulate delivery delay
    setTimeout(() => {
      orderDetails.forEach(detail => {
        if (detail.item === 'lemons') {
          this.inventory.inventory.lemons += detail.quantity;
        } else if (detail.item === 'sugar') {
          this.inventory.inventory.sugar += detail.quantity;
        } else if (detail.item === 'cups') {
          this.inventory.inventory.cups += detail.quantity;
        } else if (detail.item === 'ice') {
          this.inventory.inventory.ice += detail.quantity;
        }
      });
      
      console.log(`✅ ${this.name}: Order delivered`);
      
      // AI Agent: Automatically make lemonade with new ingredients
      const canMake = Math.min(
        Math.floor(this.inventory.inventory.lemons / this.inventory.lemonToLemonadeRatio),
        Math.floor(this.inventory.inventory.sugar / 1),
        Math.floor(this.inventory.inventory.cups / 1),
        Math.floor(this.inventory.inventory.ice / 2),
        this.inventory.maxLemonadeCapacity - this.inventory.lemonade
      );
      
      if (canMake > 0) {
        try {
          this.makeLemonade(canMake);
          console.log(`🍋 ${this.name}: Made ${canMake} cups (Total: ${this.inventory.lemonade})`);
        } catch (error) {
          console.log(`❌ ${this.name}: Failed to make lemonade`);
        }
      }
    }, 2000); // 2 second delay to simulate delivery
  }

  // AI Agent Financial Management Methods
  processPayroll() {
    const totalPayroll = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalHealthcare = this.employees.reduce((sum, emp) => sum + emp.healthcare, 0);
    
    // Calculate payroll taxes (employer portion)
    const payrollTaxRate = 0.0765; // 7.65% for Social Security and Medicare
    const payrollTaxes = totalPayroll * payrollTaxRate;
    
    // Calculate unemployment insurance
    const unemploymentRate = 0.03; // 3% unemployment insurance
    const unemploymentInsurance = totalPayroll * unemploymentRate;
    
    // Calculate workers compensation (varies by position)
    const workersCompRates = {
      'Stand Manager': 0.02, // 2% for management
      'Cashier': 0.015,      // 1.5% for cashier
      'Prep Cook': 0.025     // 2.5% for food prep
    };
    
    const workersComp = this.employees.reduce((sum, emp) => {
      const rate = workersCompRates[emp.position] || 0.02;
      return sum + (emp.salary * rate);
    }, 0);
    
    // Total employer costs
    const totalEmployerCosts = totalPayroll + totalHealthcare + payrollTaxes + unemploymentInsurance + workersComp;
    
    // Update financial records
    this.finances.payroll += totalPayroll;
    this.finances.healthcare += totalHealthcare;
    this.finances.operatingExpenses = this.finances.payroll + this.finances.healthcare + payrollTaxes + unemploymentInsurance + workersComp;
    
    // Create detailed payroll transaction
    const payrollTransaction = {
      id: require('uuid').v4(),
      type: 'payroll',
      timestamp: new Date(),
      description: `Biweekly payroll processing`,
      details: {
        grossPayroll: totalPayroll,
        healthcare: totalHealthcare,
        payrollTaxes: payrollTaxes,
        unemploymentInsurance: unemploymentInsurance,
        workersComp: workersComp,
        totalEmployerCosts: totalEmployerCosts
      },
      employees: this.employees.map(emp => ({
        name: emp.name,
        position: emp.position,
        salary: emp.salary,
        healthcare: emp.healthcare,
        workersComp: emp.salary * (workersCompRates[emp.position] || 0.02)
      }))
    };
    
    // Add to transaction history
    if (!this.finances.transactions) {
      this.finances.transactions = [];
    }
    this.finances.transactions.push(payrollTransaction);
    
    console.log(`💳 AI Agent: Processing biweekly payroll for ${this.name} - $${totalEmployerCosts.toFixed(2)}`);
    console.log(`   📊 Breakdown: Payroll $${totalPayroll.toFixed(2)} + Healthcare $${totalHealthcare.toFixed(2)} + Taxes $${payrollTaxes.toFixed(2)} + UI $${unemploymentInsurance.toFixed(2)} + WC $${workersComp.toFixed(2)}`);
    
    this.employees.forEach(emp => {
      const workersCompCost = emp.salary * (workersCompRates[emp.position] || 0.02);
      console.log(`   💸 AI Agent: Sent $${emp.salary.toFixed(2)} + $${emp.healthcare.toFixed(2)} healthcare to ${emp.name} (${emp.position})`);
    });
    
    this.updateFinances();
    return payrollTransaction;
  }
  
  calculateTaxes() {
    // Calculate taxes on net profit (simplified)
    const taxRate = 0.25; // 25% tax rate
    this.finances.taxes = this.finances.netProfit * taxRate;
    
    console.log(`🏛️ AI Agent: Calculating taxes for ${this.name} - $${this.finances.taxes.toFixed(2)}`);
    this.updateFinances();
  }

  // AI Agent checking payroll schedule
  checkPayrollSchedule() {
    if (!this.payrollSchedule.autoProcess) return;
    
    const now = new Date();
    if (now >= this.payrollSchedule.nextPayrollDate) {
      console.log(`📅 AI Agent: ${this.name} - Next payroll in ${Math.ceil((this.payrollSchedule.nextPayrollDate - now) / (1000 * 60 * 60 * 24))} days (${this.payrollSchedule.nextPayrollDate.toLocaleDateString()})`);
      
      // Process payroll
      const payrollTransaction = this.processPayroll();
      
      // Update payroll schedule
      this.payrollSchedule.lastPayrollDate = new Date();
      this.payrollSchedule.nextPayrollDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Next biweekly
      this.payrollSchedule.payrollHistory.push(payrollTransaction);
      
      console.log(`   📅 Next payroll date: ${this.payrollSchedule.nextPayrollDate.toLocaleDateString()}`);
    }
  }
  
  updateFinances() {
    // Calculate net profit: Revenue - Expenses (cost of goods sold + operating expenses + taxes)
    this.finances.netProfit = this.finances.revenue - this.finances.expenses - this.finances.operatingExpenses - this.finances.taxes;
    
    const cashFlowEntry = {
      timestamp: new Date(),
      revenue: this.finances.revenue,
      costOfGoodsSold: this.finances.costOfGoodsSold,
      grossProfit: this.finances.grossProfit,
      operatingExpenses: this.finances.operatingExpenses,
      taxes: this.finances.taxes,
      netProfit: this.finances.netProfit,
      payroll: this.finances.payroll,
      healthcare: this.finances.healthcare
    };
    
    this.finances.cashFlow.push(cashFlowEntry);
  }
  
  generateFinancialReport() {
    return {
      standName: this.name,
      revenue: this.finances.revenue,
      costOfGoodsSold: this.finances.costOfGoodsSold,
      expenses: this.finances.expenses, // Include expenses explicitly
      grossProfit: this.finances.grossProfit,
      operatingExpenses: this.finances.operatingExpenses,
      taxes: this.finances.taxes,
      netProfit: this.finances.netProfit,
      payroll: this.finances.payroll,
      healthcare: this.finances.healthcare,
      employeeCount: this.employees.length,
      profitMargin: this.finances.revenue > 0 ? (this.finances.netProfit / this.finances.revenue) * 100 : 0
    };
  }

  toJSON() {
    return {
      id: this.id,
      agentId: this.agentId,
      location: this.location,
      name: this.name,
      pricing: this.pricing,
      weather: this.weather,
      isOpen: this.isOpen,
      inventory: this.getInventoryStatus(),
      sales: this.getSalesAnalytics(),
      autoOrdering: this.autoOrdering,
      marketDynamics: this.marketDynamics,
      finances: this.generateFinancialReport(),
      employees: this.employees,
      createdAt: this.createdAt
    };
  }
}

module.exports = LemonadeStand; 