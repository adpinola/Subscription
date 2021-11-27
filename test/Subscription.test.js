let Subscription = artifacts.require("./Subscription.sol");

contract("Subscription Contract should", (accounts) => {
  let contractUnderTest;
  const baseValueWei = 100000000;
  let owner;
  let subscriber;

  beforeEach(async () => {
    owner = accounts[0];
    subscriber = accounts[1];
    contractUnderTest = await Subscription.new(baseValueWei);
  });

  it("return balance 0 by default", async () => {
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(0);
  });

  it("return an error if other but the owner asks for balance", async () => {
    const ERROR_MSG =
      "Returned error: VM Exception while processing transaction: revert Only the owner can call this method";
    try {
      await contractUnderTest.getBalance.call({ from: subscriber });
    } catch (error) {
      expect(error.message).to.equal(ERROR_MSG);
    }
  });

  it("register a new subscriber and update the balance if the payed amount is correct", async () => {
    await contractUnderTest.subscribe({
      from: subscriber,
      value: baseValueWei,
    });
    const balance = await contractUnderTest.getBalance.call({ from: owner });
    expect(balance.toNumber()).to.equal(baseValueWei);
  });

  it("register a new subscriber and update the balance if the payed amount is correct", async () => {
    const ERROR_REASON = "Insufficient funds";
    try {
      await contractUnderTest.subscribe({
        from: subscriber,
        value: baseValueWei - 1,
      });
    } catch (error) {
      expect(error.reason).to.equal(ERROR_REASON);
    }
  });
});
