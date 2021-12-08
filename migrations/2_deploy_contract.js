const Subscription = artifacts.require('../contracts/Subscription.sol');
const { subscriptionValue, durationInMinutes } = require('../environment.json');

const deploy = async (deployer, network, accounts) => {
  await deployer.deploy(Subscription, subscriptionValue, durationInMinutes);
};

module.exports = deploy;
