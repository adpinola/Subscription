const Subscription = artifacts.require('./Subscription.sol');
const timeMachine = require('ganache-time-traveler');

const { subscriptionValue, durationInMinutes } = require('../environment.json');

contract('Subscription Contract should', (accounts) => {
  let contractUnderTest;
  let owner;
  let subscriber;
  let snapshotId;

  beforeEach(async () => {
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot['result'];
    owner = accounts[0];
    subscriber = accounts[1];
    contractUnderTest = await Subscription.new(subscriptionValue, durationInMinutes, { from: owner });
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  it('return balance 0 by default', async () => {
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(0);
  });

  it('return an error if other but the owner asks for balance', async () => {
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert Not Owner';
    try {
      await contractUnderTest.getBalance.call({ from: subscriber });
    } catch (error) {
      expect(error.message).to.equal(ERROR_MSG);
    }
  });

  it('register a new subscriber and update the balance if the payed amount is correct', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(subscriptionValue);
  });

  it('return an error if the ammount sent to perform the subscription is invalid', async () => {
    const ERROR_REASON = 'Insufficient funds';
    try {
      await contractUnderTest.subscribe({
        from: subscriber,
        value: subscriptionValue - 1,
      });
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });

  it('return an error if the new subscriber was already subscribed', async () => {
    const ERROR_REASON = 'Already Subscribed';
    try {
      await contractUnderTest.subscribe({
        from: subscriber,
        value: subscriptionValue,
      });
      await contractUnderTest.subscribe({
        from: subscriber,
        value: subscriptionValue,
      });
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
      const balance = await contractUnderTest.getBalance.call({ from: owner });
      expect(balance.toNumber()).to.equal(subscriptionValue);
    }
  });

  it('return the subcription status as a boolean', async () => {
    const initialSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(initialSubscriptionStatus).to.be.false;
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    const finalSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(finalSubscriptionStatus).to.be.true;
  });

  it('return "false" if the subcription has expired', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    await timeMachine.advanceTimeAndBlock(durationInMinutes * 60 + 1);
    const finalSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(finalSubscriptionStatus).to.be.false;
  });

  it('allow a subscriber to renew its subscription after it has expired', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    await timeMachine.advanceTimeAndBlock(durationInMinutes * 60 + 1);
    await contractUnderTest.renew({
      from: subscriber,
      value: subscriptionValue,
    });
    const finalSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(finalSubscriptionStatus).to.be.true;
  });
});
