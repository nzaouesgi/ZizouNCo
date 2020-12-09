var RealEstateMarket = artifacts.require("./RealEstateMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(RealEstateMarket);
};
