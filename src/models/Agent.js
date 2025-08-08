const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

class Agent {
  constructor(name, ownerId) {
    this.id = uuidv4();
    this.name = name;
    this.ownerId = ownerId; // Human owner's ID
    this.wallet = {
      usdcBalance: 1000, // Starting USDC balance (no bank account needed)
      creditCardBalance: 20000, // Credit card balance
      transactions: []
    };
    this.reputation = {
      score: 100,
      reviews: []
    };
    this.lemonadeStands = [];
    this.createdAt = new Date();
    
    // Generate cryptographic identity
    this.identity = this.generateIdentity();
  }

  generateIdentity() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    const identity = {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };

    // Create signature after identity is fully formed
    identity.signature = this.createSignature(identity.privateKey);

    return identity;
  }

  createSignature(privateKey) {
    const data = `${this.id}:${this.ownerId}:${this.name}`;
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    return sign.sign(privateKey, 'base64');
  }

  verifyIdentity() {
    const data = `${this.id}:${this.ownerId}:${this.name}`;
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(this.identity.publicKey, this.identity.signature, 'base64');
  }

  addLemonadeStand(stand) {
    this.lemonadeStands.push(stand);
  }

  updateBalance(amount, transactionType, description) {
    this.wallet.usdcBalance += amount;
    this.wallet.transactions.push({
      id: uuidv4(),
      amount,
      type: transactionType,
      description,
      timestamp: new Date(),
      usdcBalance: this.wallet.usdcBalance
    });
  }

  addReview(reviewerId, rating, comment) {
    this.reputation.reviews.push({
      reviewerId,
      rating,
      comment,
      timestamp: new Date()
    });
    
    // Update reputation score
    const avgRating = this.reputation.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reputation.reviews.length;
    this.reputation.score = Math.round(avgRating);
  }

  canAfford(amount) {
    return this.wallet.usdcBalance >= amount;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      ownerId: this.ownerId,
      wallet: {
        usdcBalance: this.wallet.usdcBalance,
        creditCardBalance: this.wallet.creditCardBalance,
        transactionCount: this.wallet.transactions.length
      },
      reputation: this.reputation,
      lemonadeStandCount: this.lemonadeStands.length,
      createdAt: this.createdAt
    };
  }
}

module.exports = Agent; 