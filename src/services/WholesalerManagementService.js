class WholesalerManagementService {
  constructor() {
    this.managementInterval = null;
    this.isActive = false;
    this.managementHistory = [];
  }

  // Start AI management of wholesalers
  startManagement(wholesalers, lemonadeStands) {
    if (this.isActive) {
      console.log('🔄 Wholesaler management already active');
      return;
    }

    this.isActive = true;
    console.log('🤖 Starting AI wholesaler management...');

    // Run management every 15 seconds
    this.managementInterval = setInterval(() => {
      this.executeManagementTasks(wholesalers, lemonadeStands);
    }, 15000); // 15 seconds

    // Also run immediately
    this.executeManagementTasks(wholesalers, lemonadeStands);
  }

  // Stop AI management
  stopManagement() {
    if (this.managementInterval) {
      clearInterval(this.managementInterval);
      this.managementInterval = null;
    }
    this.isActive = false;
    console.log('⏹️ Wholesaler management stopped');
  }

  // Execute management tasks
  async executeManagementTasks(wholesalers, lemonadeStands) {
    if (!this.isActive) return;

    const wholesalersList = Array.from(wholesalers.values());
    const standsList = Array.from(lemonadeStands.values());

    console.log('🤖 AI Agents managing wholesaler operations...');

    // Task 1: Inventory Management
    wholesalersList.forEach(wholesaler => {
      wholesaler.manageInventory();
    });

    // Task 2: Process Orders from Stands
    standsList.forEach(stand => {
      const wholesaler = wholesalers.get(stand.autoOrdering.preferredWholesaler);
      if (wholesaler) {
        stand.checkInventoryAndOrder(wholesaler);
      }
    });

    // Task 3: Payroll Processing (simulate monthly payroll)
    const now = new Date();
    if (now.getDate() === 1) { // First day of month
      wholesalersList.forEach(wholesaler => {
        wholesaler.processPayroll();
      });
    }

    // Task 4: Financial Reporting
    wholesalersList.forEach(wholesaler => {
      const report = wholesaler.generateFinancialReport();
      console.log(`📊 AI Agent: Financial report for ${wholesaler.name}:`);
      console.log(`   Revenue: $${report.monthlyRevenue.toFixed(2)}`);
      console.log(`   Profit: $${report.currentProfit.toFixed(2)}`);
      console.log(`   Inventory: ${report.currentInventory} lemons`);
      console.log(`   Employees: ${report.employeeCount}`);
    });

    // Record management activity
    this.managementHistory.push({
      timestamp: new Date(),
      tasks: ['inventory', 'orders', 'payroll', 'reporting'],
      wholesalersManaged: wholesalersList.length,
      standsMonitored: standsList.length
    });
  }

  // Get management statistics
  getManagementStats() {
    if (this.managementHistory.length === 0) {
      return {
        totalSessions: 0,
        totalTasks: 0,
        activeManagement: 0,
        lastActivity: null
      };
    }

    const totalSessions = this.managementHistory.length;
    const totalTasks = this.managementHistory.reduce((sum, session) => 
      sum + session.tasks.length, 0
    );

    return {
      totalSessions,
      totalTasks,
      activeManagement: this.isActive ? 1 : 0,
      lastActivity: this.managementHistory[this.managementHistory.length - 1].timestamp
    };
  }

  // Get recent management history
  getRecentManagement(limit = 10) {
    return this.managementHistory
      .slice(-limit)
      .reverse()
      .map(session => ({
        ...session,
        timestamp: session.timestamp.toISOString()
      }));
  }

  // Check if management is active
  isManagementActive() {
    return this.isActive;
  }
}

module.exports = WholesalerManagementService; 