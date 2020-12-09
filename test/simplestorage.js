const RealEstateMarket = artifacts.require("./RealEstateMarketContract.sol");

contract("RealEstateMarketContract", accounts => {
  it("should read all properties", async () => {
    
    const realEstateMarketContractInstance = await RealEstateMarket.deployed();

    console.log(realEstateMarketContractInstance.addProperty)

    await realEstateMarketContractInstance.addProperty.sendTransaction(
      1, 
      'blablabla', 
      'blablabla', 
      [], 
      [], 
      { from: accounts[0] })

    const properties = await realEstateMarketContractInstance.properties.call(0)

    console.log(properties)

    // Set value of 89
    //await readEstateMarketInstance.set(89, { from: accounts[0] });

    // Get stored value
    //const storedData = await readEstateMarketInstance.get.call();

    //assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
