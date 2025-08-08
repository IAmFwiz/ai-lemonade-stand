const crypto = require('crypto');
const uuid = require('uuid');

class Wholesaler {
  constructor(name, ownerId, location) {
    this.id = uuid.v4();
    this.name = name;
    this.ownerId = ownerId;
    this.location = location;
    this.inventory = {
      lemons: 1000, // Starting inventory
      lemonPrice: 0.50, // Price per lemon
      reorderThreshold: 200, // When to reorder
      reorderQuantity: 500 // How many to reorder
    };
    this.finances = {
      revenue: 0,
      expenses: 0,
      costOfGoodsSold: 0,
      grossProfit: 0,
      operatingExpenses: 0,
      netProfit: 0,
      taxes: 0,
      healthcare: 0,
      payroll: 0,
      profit: 0,
      cashFlow: []
    };
    this.employees = [
      { id: 'emp1', name: 'Carlos Rodriguez', position: 'Farm Manager', salary: 3500, healthcare: 500 },
      { id: 'emp2', name: 'Maria Garcia', position: 'Harvester', salary: 2800, healthcare: 400 },
      { id: 'emp3', name: 'Jose Martinez', position: 'Logistics', salary: 3200, healthcare: 450 }
    ];
    
    // AI Agent Payroll Management
    this.payrollSchedule = {
      frequency: 'biweekly', // biweekly payroll
      lastPayrollDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      nextPayrollDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      autoProcess: true,
      payrollHistory: []
    };
    
    this.orders = [];
    this.generateIdentity();
  }

  generateIdentity() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    this.identity = {
      publicKey,
      privateKey,
      signature: this.createSignature(privateKey)
    };
  }

  // Calculate lemon price based on comprehensive pricing factors
  calculateLemonPrice(quantity = 1) {
    if (!this.pricingFactors) {
      return this.inventory.lemonPrice; // Fallback to existing price
    }

    const factors = this.pricingFactors;
    
    // Start with base price
    let price = factors.basePrice;
    
    // Apply quality multiplier
    price *= factors.qualityMultiplier;
    
    // Apply farming practice multiplier
    if (factors.farmingPractice === 'organic') {
      price *= 1.3; // 30% premium for organic
    }
    
    // Apply source type multiplier
    switch (factors.sourceType) {
      case 'local':
        price *= 1.1; // 10% premium for local freshness
        break;
      case 'imported':
        price *= 0.9; // 10% discount for imported
        break;
      // domestic stays at 1.0
    }
    
    // Apply seasonal adjustment
    price *= factors.seasonalAdjustment;
    
    // Apply value-added services
    if (factors.valueAddedServices.washing) price += 0.02;
    if (factors.valueAddedServices.sorting) price += 0.03;
    if (factors.valueAddedServices.packaging === 'premium') price += 0.05;
    if (factors.valueAddedServices.coldStorage) price += 0.03;
    
    // Apply transport cost
    price += factors.transportCost;
    
    // Apply volume discount
    const volumeDiscount = this.getVolumeDiscount(quantity, factors.volumeDiscounts);
    price *= volumeDiscount;
    
    // Apply reliability adjustment (higher reliability = slightly higher price)
    price *= (1 + (factors.reliabilityScore - 0.9) * 0.1);
    
    return Math.round(price * 100) / 100; // Round to 2 decimal places
  }

  // Get volume discount based on quantity
  getVolumeDiscount(quantity, volumeDiscounts) {
    const thresholds = Object.keys(volumeDiscounts).map(Number).sort((a, b) => b - a);
    
    for (const threshold of thresholds) {
      if (quantity >= threshold) {
        return volumeDiscounts[threshold];
      }
    }
    
    return 1.0; // No discount
  }

  createSignature(privateKey) {
    const data = `${this.name}${this.id}${this.ownerId}`;
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'hex');
  }

  verifyIdentity() {
    const data = `${this.name}${this.id}${this.ownerId}`;
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(this.identity.publicKey, this.identity.signature, 'hex');
  }

  // AI Agent managing inventory
  manageInventory() {
    if (this.inventory.lemons <= this.inventory.reorderThreshold) {
      console.log(`🤖 AI Agent: ${this.name} is low on lemons (${this.inventory.lemons}). Auto-reordering...`);
      this.reorderLemons();
    }
    
    // Adjust pricing based on supply and demand
    this.adjustPricing();
  }

  // AI Agent auto-reordering
  reorderLemons() {
    const orderQuantity = this.inventory.reorderQuantity;
    const orderCost = orderQuantity * this.inventory.lemonPrice;
    
    console.log(`📦 AI Agent: Auto-ordering ${orderQuantity} lemons for $${orderCost.toFixed(2)}`);
    
    // Simulate delivery delay
    setTimeout(() => {
      this.inventory.lemons += orderQuantity;
      this.finances.expenses += orderCost;
      this.updateFinances();
      console.log(`✅ AI Agent: ${orderQuantity} lemons delivered to ${this.name}`);
    }, 3000); // 3 second delay to simulate delivery
  }

  // AI Agent managing pricing
  adjustPricing() {
    const demandFactor = this.getDemandFactor();
    const supplyFactor = this.inventory.lemons / 1000; // Normalized supply
    
    // Dynamic pricing based on supply and demand
    const newPrice = 0.50 * (1 + demandFactor) * (1 + (1 - supplyFactor));
    this.inventory.lemonPrice = Math.max(0.30, Math.min(0.80, newPrice));
  }

  getDemandFactor() {
    // Simulate seasonal demand
    const month = new Date().getMonth();
    if (month >= 5 && month <= 8) { // Summer months
      return 0.3; // Higher demand
    } else if (month >= 11 || month <= 2) { // Winter months
      return -0.2; // Lower demand
    }
    return 0; // Normal demand
  }

  // AI Agent processing orders with dynamic pricing
  processOrder(customerId, quantity, customerName) {
    if (this.inventory.lemons < quantity) {
      throw new Error('Insufficient inventory');
    }

    // Calculate price using comprehensive pricing logic
    const pricePerLemon = this.calculateLemonPrice(quantity);
    const totalCost = quantity * pricePerLemon;
    
    // Calculate cost of goods sold based on quality tier
    let costPerLemon = 0.25; // Base cost
    if (this.pricingFactors) {
      switch (this.quality) {
        case 'premium':
          costPerLemon = 0.35; // Higher cost for premium lemons
          break;
        case 'standard':
          costPerLemon = 0.28; // Standard cost
          break;
        case 'budget':
          costPerLemon = 0.20; // Lower cost for budget lemons
          break;
      }
    }
    
    const costOfGoodsSold = quantity * costPerLemon;
    
    this.inventory.lemons -= quantity;
    this.finances.revenue += totalCost;
    this.finances.costOfGoodsSold += costOfGoodsSold;
    this.finances.grossProfit = this.finances.revenue - this.finances.costOfGoodsSold;
    
    // Calculate volume discount applied
    let volumeDiscountApplied = 1.0;
    if (this.pricingFactors && this.pricingFactors.volumeDiscounts) {
      volumeDiscountApplied = this.getVolumeDiscount(quantity, this.pricingFactors.volumeDiscounts);
    }
    
    const order = {
      id: uuid.v4(),
      customerId,
      customerName,
      quantity,
      pricePerLemon,
      totalCost,
      costOfGoodsSold,
      grossProfit: totalCost - costOfGoodsSold,
      volumeDiscountApplied,
      quality: this.quality,
      certification: this.pricingFactors?.certification || 'Standard',
      timestamp: new Date(),
      status: 'completed'
    };
    
    this.orders.push(order);
    this.updateFinances();
    
    const profit = totalCost - costOfGoodsSold;
    const discountInfo = volumeDiscountApplied < 1.0 ? ` (${Math.round((1 - volumeDiscountApplied) * 100)}% volume discount applied)` : '';
    
    console.log(`💰 AI Agent: Processed order for ${customerName} - ${quantity} lemons for $${totalCost.toFixed(2)} (Profit: $${profit.toFixed(2)})${discountInfo}`);
    
    return order;
  }

  // AI Agent managing payroll
  processPayroll() {
    const totalPayroll = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    const totalHealthcare = this.employees.reduce((sum, emp) => sum + emp.healthcare, 0);
    
    this.finances.payroll += totalPayroll;
    this.finances.healthcare += totalHealthcare;
    this.finances.operatingExpenses = this.finances.payroll + this.finances.healthcare;
    
    // Update payroll schedule
    this.payrollSchedule.lastPayrollDate = new Date();
    this.payrollSchedule.nextPayrollDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // Next biweekly
    
    // Record payroll history
    const payrollRecord = {
      date: new Date(),
      totalPayroll,
      totalHealthcare,
      employees: this.employees.map(emp => ({
        name: emp.name,
        position: emp.position,
        salary: emp.salary,
        healthcare: emp.healthcare
      }))
    };
    this.payrollSchedule.payrollHistory.push(payrollRecord);
    
    console.log(`💳 AI Agent: Processing biweekly payroll for ${this.name} - $${totalPayroll.toFixed(2)}`);
    console.log(`   📅 Next payroll date: ${this.payrollSchedule.nextPayrollDate.toLocaleDateString()}`);
    this.employees.forEach(emp => {
      console.log(`   💸 AI Agent: Sent $${emp.salary.toFixed(2)} + $${emp.healthcare.toFixed(2)} healthcare to ${emp.name} (${emp.position})`);
    });
    
    this.updateFinances();
  }

  // AI Agent calculating taxes
  calculateTaxes() {
    // Calculate taxes on net profit (simplified)
    const taxRate = 0.25; // 25% tax rate
    this.finances.taxes = this.finances.netProfit * taxRate;
    
    console.log(`🏛️ AI Agent: Calculating taxes for ${this.name} - $${this.finances.taxes.toFixed(2)}`);
    this.updateFinances();
  }
  
  // AI Agent checking payroll schedule
  checkPayrollSchedule() {
    const now = new Date();
    const daysUntilPayroll = Math.ceil((this.payrollSchedule.nextPayrollDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilPayroll <= 0) {
      console.log(`⏰ AI Agent: Payroll due for ${this.name} - Processing automatically`);
      this.processPayroll();
      return true;
    } else {
      console.log(`📅 AI Agent: ${this.name} - Next payroll in ${daysUntilPayroll} days (${this.payrollSchedule.nextPayrollDate.toLocaleDateString()})`);
      return false;
    }
  }
  
  // AI Agent managing finances
  updateFinances() {
    this.finances.netProfit = this.finances.grossProfit - this.finances.operatingExpenses - this.finances.taxes;
    this.finances.profit = this.finances.netProfit; // Keep for backward compatibility
    
    const cashFlowEntry = {
      timestamp: new Date(),
      revenue: this.finances.revenue,
      costOfGoodsSold: this.finances.costOfGoodsSold,
      grossProfit: this.finances.grossProfit,
      operatingExpenses: this.finances.operatingExpenses,
      taxes: this.finances.taxes,
      netProfit: this.finances.netProfit,
      payroll: this.finances.payroll,
      healthcare: this.finances.healthcare,
      inventoryValue: this.inventory.lemons * this.inventory.lemonPrice
    };
    
    this.finances.cashFlow.push(cashFlowEntry);
  }

  // AI Agent generating financial reports
  generateFinancialReport() {
    const currentMonth = new Date().getMonth();
    const monthlyOrders = this.orders.filter(order => 
      order.timestamp.getMonth() === currentMonth
    );
    
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalCost, 0);
    
    // Calculate days until next payroll
    const now = new Date();
    const daysUntilPayroll = Math.ceil((this.payrollSchedule.nextPayrollDate - now) / (1000 * 60 * 60 * 24));
    
    return {
      wholesalerName: this.name,
      currentInventory: this.inventory.lemons,
      lemonPrice: this.inventory.lemonPrice,
      monthlyRevenue,
      totalRevenue: this.finances.revenue,
      costOfGoodsSold: this.finances.costOfGoodsSold,
      grossProfit: this.finances.grossProfit,
      operatingExpenses: this.finances.operatingExpenses,
      taxes: this.finances.taxes,
      netProfit: this.finances.netProfit,
      totalPayroll: this.finances.payroll,
      totalHealthcare: this.finances.healthcare,
      employeeCount: this.employees.length,
      ordersThisMonth: monthlyOrders.length,
      averageOrderValue: monthlyOrders.length > 0 ? monthlyRevenue / monthlyOrders.length : 0,
      profitMargin: this.finances.revenue > 0 ? (this.finances.netProfit / this.finances.revenue) * 100 : 0,
      payrollSchedule: {
        frequency: this.payrollSchedule.frequency,
        lastPayrollDate: this.payrollSchedule.lastPayrollDate,
        nextPayrollDate: this.payrollSchedule.nextPayrollDate,
        daysUntilPayroll: daysUntilPayroll,
        autoProcess: this.payrollSchedule.autoProcess,
        payrollHistoryCount: this.payrollSchedule.payrollHistory.length
      }
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      location: this.location,
      inventory: this.inventory,
      finances: this.finances,
      employees: this.employees,
      orderCount: this.orders.length,
      financialReport: this.generateFinancialReport(),
      quality: this.quality,
      description: this.description,
      pricingFactors: this.pricingFactors
    };
  }
}

module.exports = Wholesaler; 