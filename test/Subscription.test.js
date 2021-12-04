const Subscription = artifacts.require('./Subscription.sol');

contract('Subscription Contract should', (accounts) => {
  let contractUnderTest;
  const baseValueWei = 100000000;
  const subscriptonDuration = 1;
  let owner;
  let subscriber;

  beforeEach(async () => {
    owner = accounts[0];
    subscriber = accounts[1];
    contractUnderTest = await Subscription.new(baseValueWei, subscriptonDuration, { from: owner });
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
      value: baseValueWei,
    });
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(baseValueWei);
  });

  it('return an error if the ammount sent to perform the subscription is invalid', async () => {
    const ERROR_REASON = 'Insufficient funds';
    try {
      await contractUnderTest.subscribe({
        from: subscriber,
        value: baseValueWei - 1,
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
        value: baseValueWei,
      });
      await contractUnderTest.subscribe({
        from: subscriber,
        value: baseValueWei,
      });
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
      const balance = await contractUnderTest.getBalance.call({ from: owner });
      expect(balance.toNumber()).to.equal(baseValueWei);
    }
  });

  it('return the subcription status as a boolean', async () => {
    const initialSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(initialSubscriptionStatus).to.be.false;
    await contractUnderTest.subscribe({
      from: subscriber,
      value: baseValueWei,
    });
    const finalSubscriptionStatus = await contractUnderTest.amISubscribed.call({ from: subscriber });
    expect(finalSubscriptionStatus).to.be.true;
  });
});
