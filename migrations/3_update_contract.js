const Subscription = artifacts.require('../contracts/Subscription.sol');
const { subscriptionValue, durationInMinutes } = require('../environment.json');

const update = async (deployer, network, accounts) => {
  await deployer.deploy(Subscription, subscriptionValue, durationInMinutes);
};

module.exports = update;
