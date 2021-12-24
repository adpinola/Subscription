/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
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
    snapshotId = snapshot.result;
    [owner, subscriber] = accounts;
    contractUnderTest = await Subscription.new(subscriptionValue, durationInMinutes, { from: owner });
  });

  afterEach(async () => {
    await timeMachine.revertToSnapshot(snapshotId);
  });

  it("return owner's address", async () => {
    const ownerAddress = await contractUnderTest.owner.call({ from: owner });
    expect(ownerAddress).to.equal(owner);
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
    expect(balance.toString()).to.equal(subscriptionValue);
  });

  it('emit an event when the subscription succeeds', async () => {
    const transaction = await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });

    const events = transaction.logs;
    expect(events.length).to.equal(1);
    const event = events[0];
    expect(event.args.from).to.equal(subscriber);
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

  it('return an error if the subscriber attempts to resuscribe before expiring current subscription', async () => {
    const ERROR_REASON = 'Subscription is still active';
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
      expect(balance.toString()).to.equal(subscriptionValue);
    }
  });

  it('return proper data if an unsubscribed user attempts to retrieve its status', async () => {
    const subscriptionData = await contractUnderTest.getSubscriptionData.call({ from: subscriber });
    expect(subscriptionData.subscribed).to.be.false;
    expect(subscriptionData.payedAmount).to.equal('0');
    expect(subscriptionData.subscribedAt).to.equal('0');
  });

  it('return "false" if the subcription has expired', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    await timeMachine.advanceTimeAndBlock(durationInMinutes * 60 + 1);
    const subscriptionData = await contractUnderTest.getSubscriptionData.call({ from: subscriber });
    expect(subscriptionData.subscribed).to.be.false;
  });

  it('allow a subscriber to renew its subscription after it has expired', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    await timeMachine.advanceTimeAndBlock(durationInMinutes * 60 + 1);
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    const subscriptionData = await contractUnderTest.getSubscriptionData.call({ from: subscriber });
    expect(subscriptionData.subscribed).to.be.true;
  });

  it('retrieve data of a subscriber if the request comes from the owner', async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: subscriptionValue,
    });
    const subscriberData = await contractUnderTest.getDataOfSubscriber(subscriber, {
      from: owner,
    });
    expect(subscriberData.subscribed).to.be.true;
    expect(subscriberData.payedAmount).to.equal(subscriptionValue.toString());
    expect(subscriberData.subscribedAt).to.not.equal(0);
  });

  it('not retrieve data of a subscriber if the request comes from anyone else but the owner', async () => {
    const ERROR_MSG = 'Returned error: VM Exception while processing transaction: revert Not Owner';
    try {
      await contractUnderTest.subscribe({
        from: subscriber,
        value: subscriptionValue,
      });
      await contractUnderTest.getDataOfSubscriber(subscriber, {
        from: subscriber,
      });
    } catch (error) {
      expect(error.message).to.equal(ERROR_MSG);
    }
  });
});
