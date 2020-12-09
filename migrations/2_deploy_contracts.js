var RealEstateMarket = artifacts.require("./RealEstateMarketContract.sol");

module.exports = function(deployer) {
  deployer.deploy(RealEstateMarket);
};
