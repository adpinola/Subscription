const Subscription = artifacts.require('../contracts/Subscription.sol');
const baseValue = 1000000000;
const durationInMinutes = 1;

const deploy = async (deployer, network, accounts) => {
  await deployer.deploy(Subscription, baseValue, durationInMinutes);
};

module.exports = deploy;
