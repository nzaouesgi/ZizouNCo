const RealEstateMarket = artifacts.require("./RealEstateMarket.sol")
const { Chance } = require('chance')
const web3 = require('web3')
const { expect } = require('chai')
const { default: BigNumber } = require('bignumber.js')

contract("RealEstateMarket", accounts => {

  const chance = new Chance()

  const range = length => [...Array(length).keys()]

  const createFakePropertyData = () => {

    const documents = []
    
    for (const _i of range(chance.integer({min: 0, max: 10}))){
      documents.push({ 
        identifier: chance.string({
          alpha: true, 
          length: chance.integer({ min: 15, max: 32 }) 
        }),
        integrity: web3.utils.bytesToHex(range(32).map(_v => chance.integer({ min: 0, max: 255 })))
      })
    }

    return [
      chance.integer({ min: 1, max: 500000 }),
      chance.string(),
      chance.string(),
      documents.map(d => d.identifier),
      documents.map(d => d.integrity),
      { from: chance.pickone(accounts) }
    ]
  }

  beforeEach(async () => {

    this.instance = await RealEstateMarket.deployed()

    this.fakePropertiesData = range(50).map(_v => createFakePropertyData())

    await Promise.all(
      this.fakePropertiesData
        .map(data => this.instance.addProperty.sendTransaction(...data)))
  
  })
  
  it("should paginate through properties", async () => {

    const pagination = await this.instance.paginateProperties.call(0)

    expect(pagination).to.be.an('object')

    expect(pagination['0']).to.be.an('array')
    expect(web3.utils.isBN(pagination['1'])).to.be.true
    expect(web3.utils.isBN(pagination['2'])).to.be.true

    console.log(pagination['1'].toNumber())

    expect(pagination['1'].cmp(25)).to.equal(0)
    expect(pagination['2'].cmp(this.fakePropertiesData.length)).to.equal(0)
  })
})
