const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.transactions = new Map();
    this.pendingTransactions = new Map();
  }

  // Create a direct payment between agents
  createPayment(fromAgent, toAgent, amount, description) {
    // Verify both agents have valid identities
    if (!fromAgent.verifyIdentity() || !toAgent.verifyIdentity()) {
      throw new Error('Invalid agent identity');
    }

    // Check if sender can afford the USDC payment
    if (!fromAgent.canAfford(amount)) {
      throw new Error('Insufficient USDC balance');
    }

    // Create payment transaction
    const transactionId = uuidv4();
    const transaction = {
      id: transactionId,
      fromAgentId: fromAgent.id,
      toAgentId: toAgent.id,
      amount,
      description,
      status: 'pending',
      timestamp: new Date(),
      signature: this.signTransaction(fromAgent, transactionId, amount, toAgent.id)
    };

    this.pendingTransactions.set(transactionId, transaction);
    return transaction;
  }

  // Execute a pending payment
  executePayment(transactionId, fromAgent, toAgent) {
    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction already processed');
    }

    // Verify the transaction signature
    if (!this.verifyTransactionSignature(fromAgent, transaction)) {
      throw new Error('Invalid transaction signature');
    }

    // Execute the payment
    fromAgent.updateBalance(-transaction.amount, 'payment', `Payment to ${toAgent.name}: ${transaction.description}`);
    toAgent.updateBalance(transaction.amount, 'receipt', `Payment from ${fromAgent.name}: ${transaction.description}`);

    // Update transaction status
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    
    this.transactions.set(transactionId, transaction);
    this.pendingTransactions.delete(transactionId);

    return {
      ...transaction,
      fromAgentUSDCBalance: fromAgent.wallet.usdcBalance,
      toAgentUSDCBalance: toAgent.wallet.usdcBalance
    };
  }

  // Sign a transaction with the sender's private key
  signTransaction(agent, transactionId, amount, toAgentId) {
    const data = `${transactionId}:${amount}:${toAgentId}`;
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(agent.identity.privateKey, 'base64');
  }

  // Verify a transaction signature
  verifyTransactionSignature(agent, transaction) {
    const data = `${transaction.id}:${transaction.amount}:${transaction.toAgentId}`;
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(agent.identity.publicKey, transaction.signature, 'base64');
  }

  // Process a lemonade purchase
  processLemonadePurchase(buyerAgent, sellerStand, sellerAgent, quantity) {
    const lemonade = sellerStand.sellLemonade(quantity, buyerAgent.id);
    const totalPrice = lemonade.totalPrice;

    // Create payment with the actual seller agent object
    const payment = this.createPayment(
      buyerAgent, 
      sellerAgent, // Pass the actual seller agent object
      totalPrice, 
      `Lemonade purchase: ${quantity} cups from ${sellerStand.name} (${sellerAgent.name})`
    );

    return {
      payment,
      lemonade,
      transactionId: lemonade.transactionId
    };
  }

  // Get transaction history for an agent
  getAgentTransactions(agentId) {
    const agentTransactions = [];
    
    for (const [id, transaction] of this.transactions) {
      if (transaction.fromAgentId === agentId || transaction.toAgentId === agentId) {
        agentTransactions.push({
          ...transaction,
          type: transaction.fromAgentId === agentId ? 'sent' : 'received'
        });
      }
    }

    return agentTransactions.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Get pending transactions for an agent
  getPendingTransactions(agentId) {
    const pending = [];
    
    for (const [id, transaction] of this.pendingTransactions) {
      if (transaction.fromAgentId === agentId || transaction.toAgentId === agentId) {
        pending.push({
          ...transaction,
          type: transaction.fromAgentId === agentId ? 'outgoing' : 'incoming'
        });
      }
    }

    return pending;
  }

  // Cancel a pending transaction
  cancelTransaction(transactionId, agentId) {
    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.fromAgentId !== agentId) {
      throw new Error('Only the sender can cancel a transaction');
    }

    if (transaction.status !== 'pending') {
      throw new Error('Transaction cannot be cancelled');
    }

    transaction.status = 'cancelled';
    transaction.cancelledAt = new Date();
    
    this.transactions.set(transactionId, transaction);
    this.pendingTransactions.delete(transactionId);

    return transaction;
  }

  // Get payment statistics
  getPaymentStats() {
    const totalTransactions = this.transactions.size;
    const pendingTransactions = this.pendingTransactions.size;
    const totalVolume = Array.from(this.transactions.values())
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalTransactions,
      pendingTransactions,
      totalVolume,
      averageTransactionValue: totalTransactions > 0 ? totalVolume / totalTransactions : 0
    };
  }
}

module.exports = PaymentService; 