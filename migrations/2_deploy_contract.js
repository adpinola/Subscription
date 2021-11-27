const Subscription = artifacts.require("../contracts/Subscription.sol");
const subscriptionBaseValue = 1000000000;

const deploy = async (deployer, network, accounts) => {
  await deployer.deploy(Subscription, subscriptionBaseValue);
};

module.exports = deploy;
