const PaymentService = require('./PaymentService');

class AutonomousTradingService {
  constructor() {
    this.paymentService = new PaymentService();
    this.tradingInterval = null;
    this.isActive = false;
    this.tradingHistory = [];
  }

  // Start autonomous trading
  startTrading(agents, lemonadeStands, wholesalers) {
    if (this.isActive) {
      console.log('🔄 Autonomous trading already active');
      return;
    }

    this.isActive = true;
    this.wholesalers = wholesalers;
    console.log('🤖 Starting autonomous AI agent trading...');
    
    // Run trading every 10 seconds
    this.tradingInterval = setInterval(() => {
      this.executeArbitrageTrades(agents, lemonadeStands, wholesalers);
    }, 10000); // 10 seconds

    // Also run immediately
    this.executeArbitrageTrades(agents, lemonadeStands, wholesalers);
  }

  // Stop autonomous trading
  stopTrading() {
    if (this.tradingInterval) {
      clearInterval(this.tradingInterval);
      this.tradingInterval = null;
    }
    this.isActive = false;
    console.log('⏹️ Autonomous trading stopped');
  }

  // Execute arbitrage trades between agents
  async executeArbitrageTrades(agents, lemonadeStands, wholesalers) {
    if (!this.isActive) return;

    const agentsList = Array.from(agents.values());
    const standsList = Array.from(lemonadeStands.values());

    // Find arbitrage opportunities
    const opportunities = this.findArbitrageOpportunities(agentsList, standsList);
    
    if (opportunities.length === 0) {
      console.log('📊 No arbitrage opportunities found at this time');
      return;
    }

    console.log(`🎯 Found ${opportunities.length} arbitrage opportunities`);
    console.log('🔍 Opportunities:', opportunities.map(opp => ({
      buyFrom: opp.buyFromStand.name,
      sellTo: opp.sellToStand.name,
      priceDiff: opp.priceDifference,
      potentialBuyers: opp.potentialBuyers.length,
      potentialSellers: opp.potentialSellers.length
    })));

    // Execute trades for each opportunity
    for (const opportunity of opportunities) {
      try {
        await this.executeTrade(opportunity, agents, lemonadeStands, wholesalers);
      } catch (error) {
        console.error(`❌ Trade execution failed: ${error.message}`);
      }
    }
  }

  // Find arbitrage opportunities
  findArbitrageOpportunities(agents, stands) {
    const opportunities = [];
    
    // Compare prices between different stands
    for (let i = 0; i < stands.length; i++) {
      for (let j = i + 1; j < stands.length; j++) {
        const stand1 = stands[i];
        const stand2 = stands[j];
        
        // Calculate price difference
        const priceDiff = Math.abs(stand1.pricing.currentPrice - stand2.pricing.currentPrice);
        const minProfitThreshold = 0.10; // Lowered threshold for testing
        
        if (priceDiff >= minProfitThreshold) {
          // Determine which stand has lower price (buy from) and higher price (sell to)
          const [buyFromStand, sellToStand] = stand1.pricing.currentPrice < stand2.pricing.currentPrice 
            ? [stand1, stand2] 
            : [stand2, stand1];
          
          // Find agents that can participate in this trade
          const potentialBuyers = agents.filter(agent => 
            agent.id !== buyFromStand.agentId && // Can't buy from their own stand
            agent.wallet.usdcBalance >= buyFromStand.pricing.currentPrice * 1 // Buy at least 1 cup
          );
          
          const potentialSellers = agents.filter(agent => 
            agent.id !== sellToStand.agentId && // Can't sell at their own stand
            agent.wallet.usdcBalance >= 10 // Lower capital requirement
          );

          if (potentialBuyers.length > 0 && potentialSellers.length > 0) {
            opportunities.push({
              buyFromStand,
              sellToStand,
              priceDifference: priceDiff,
              potentialProfit: priceDiff * 2, // Assuming 2 cups per trade
              potentialBuyers,
              potentialSellers,
              timestamp: new Date()
            });
          } else {
            console.log(`⚠️ Skipping opportunity: ${buyFromStand.name} (${buyFromStand.pricing.currentPrice}) → ${sellToStand.name} (${sellToStand.pricing.currentPrice})`);
            console.log(`   Potential buyers: ${potentialBuyers.length}, Potential sellers: ${potentialSellers.length}`);
          }
        }
      }
    }
    
    return opportunities;
  }

  // Execute a single trade
  async executeTrade(opportunity, agents, lemonadeStands, wholesalers) {
    const { buyFromStand, sellToStand, priceDifference, potentialBuyers, potentialSellers } = opportunity;
    
    // Select random buyer and seller from potential candidates
    const buyer = potentialBuyers[Math.floor(Math.random() * potentialBuyers.length)];
    const seller = potentialSellers[Math.floor(Math.random() * potentialSellers.length)];
    
    // Additional safety check to ensure buyer and seller are different
    if (!buyer || !seller || buyer.id === seller.id) {
      console.log('⚠️ Skipping trade: Invalid buyer/seller combination');
      return null;
    }
    
    // Determine trade quantity (1-3 cups)
    const quantity = Math.floor(Math.random() * 3) + 1;
    const buyPrice = buyFromStand.pricing.currentPrice;
    const sellPrice = sellToStand.pricing.currentPrice;
    
    try {
      // Step 1: Buyer purchases lemonade from the lower-priced stand
      const purchaseResult = this.paymentService.processLemonadePurchase(
        buyer,
        buyFromStand,
        agents.get(buyFromStand.agentId),
        quantity
      );

      if (!purchaseResult) {
        throw new Error('Purchase failed');
      }

      // Trigger inventory check and auto-ordering for the stand that was bought from
      if (buyFromStand.autoOrdering.preferredWholesaler) {
        const wholesaler = wholesalers.get(buyFromStand.autoOrdering.preferredWholesaler);
        if (wholesaler) {
          buyFromStand.checkInventoryAndOrder(wholesaler);
        }
      }

      // Step 2: Seller sells lemonade at the higher-priced stand (arbitrage)
      // This simulates the seller having inventory to sell
      const sellerStand = sellToStand;
      const profitPerCup = sellPrice - buyPrice;
      const totalProfit = profitPerCup * quantity;

      // Update seller's balance with profit
      seller.updateBalance(totalProfit);

      // Record the arbitrage trade
      const tradeRecord = {
        id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        buyer: buyer.name,
        seller: seller.name,
        buyFromStand: buyFromStand.name,
        sellToStand: sellToStand.name,
        quantity,
        buyPrice,
        sellPrice,
        profitPerCup,
        totalProfit,
        timestamp: new Date(),
        type: 'arbitrage'
      };

      this.tradingHistory.push(tradeRecord);

      console.log(`💰 Arbitrage Trade Executed:`);
      console.log(`   Buyer: ${buyer.name} (${buyer.wallet.usdcBalance.toFixed(2)} USDC)`);
      console.log(`   Seller: ${seller.name} (${seller.wallet.usdcBalance.toFixed(2)} USDC)`);
      console.log(`   Bought ${quantity} cups from ${buyFromStand.name} at $${buyPrice.toFixed(2)}`);
      console.log(`   Sold ${quantity} cups at ${sellToStand.name} at $${sellPrice.toFixed(2)}`);
      console.log(`   Profit: $${totalProfit.toFixed(2)} (${profitPerCup.toFixed(2)} per cup)`);

      return tradeRecord;

    } catch (error) {
      console.error(`❌ Trade execution failed: ${error.message}`);
      throw error;
    }
  }

  // Get trading statistics
  getTradingStats() {
    if (this.tradingHistory.length === 0) {
      return {
        totalTrades: 0,
        totalVolume: 0,
        totalProfit: 0,
        averageProfit: 0,
        activeTrades: 0
      };
    }

    const totalTrades = this.tradingHistory.length;
    const totalVolume = this.tradingHistory.reduce((sum, trade) => sum + (trade.buyPrice * trade.quantity), 0);
    const totalProfit = this.tradingHistory.reduce((sum, trade) => sum + trade.totalProfit, 0);
    const averageProfit = totalProfit / totalTrades;

    return {
      totalTrades,
      totalVolume: totalVolume.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      averageProfit: averageProfit.toFixed(2),
      activeTrades: this.isActive ? 1 : 0
    };
  }

  // Get recent trading history
  getRecentTrades(limit = 10) {
    return this.tradingHistory
      .slice(-limit)
      .reverse()
      .map(trade => ({
        ...trade,
        timestamp: trade.timestamp.toISOString()
      }));
  }

  // Check if trading is active
  isTradingActive() {
    return this.isActive;
  }
}

module.exports = AutonomousTradingService; 