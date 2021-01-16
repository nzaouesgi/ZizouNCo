const RealEstateMarket = artifacts.require("./RealEstateMarket.sol")
const { Chance } = require('chance')
const web3 = require('web3')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const { expect } = chai

contract("RealEstateMarket", accounts => {

  const chance = new Chance()

  const range = length => [...Array(length).keys()]

  const createFakePropertyData = () => {

    return {
      price: chance.integer({ min: 1, max: 200 }),
      description: chance.string(),
      location: chance.string(),
      documents: range(chance.integer({ min: 0, max: 10 })).map(_v => {
        return {
          identifier: chance.string({
            alpha: true,
            length: chance.integer({ min: 15, max: 32 })
          }),
          integrity: web3.utils.bytesToHex(range(32).map(_v => chance.integer({ min: 0, max: 255 })))
        }
      })
    }
  }

  const addProperty = async ({ price, location, description, documents }, from, instance) => instance.addProperty.sendTransaction(
    price, 
    location, 
    description, 
    documents.map(d => d.identifier), 
    documents.map(d => d.integrity), 
    { from }
  )

  describe('paginateProperties', function () {

    before(async function () {

      this.instance = await RealEstateMarket.new()

      this.fakePropertiesData = range(chance.integer({ 
        min: 3,
        max: 30
      })).map(_v => createFakePropertyData())

      for (const data of this.fakePropertiesData){
        await addProperty(
          data, 
          chance.pickone(accounts), 
          this.instance)
      }

      /*await Promise.all(
        this.fakePropertiesData
          .map(data => addProperty(
            data, 
            chance.pickone(accounts), 
            this.instance)))*/

    })

    it("should paginate through properties", async function () {

      const itemsPerPage = 25

      const check = async page => {

        const pagination = await this.instance.paginateProperties.call(page)

        expect(pagination).to.be.an('object')

        expect(pagination['0']).to.be.an('array')
        expect(web3.utils.isBN(pagination['1'])).to.be.true
        expect(web3.utils.isBN(pagination['2'])).to.be.true

        expect(pagination['2'].cmp(new web3.utils.BN(this.fakePropertiesData.length))).to.equal(0)

        const properties = pagination['0']

        range(pagination['1'].toNumber()).forEach((_v, i) => {
          
          const y = i + (page * itemsPerPage) 

          expect(properties[i].price).to.equal(this.fakePropertiesData[y].price.toString())
          expect(properties[i].location).to.equal(this.fakePropertiesData[y].location)
          expect(properties[i].description).to.equal(this.fakePropertiesData[y].description)
          expect(properties[i].forSale).to.be.true
          expect(parseInt(properties[i].createdAt)).to.be.a('number')
        
        })
      
      }

      await Promise.all(
        range(Math.ceil(this.fakePropertiesData.length / itemsPerPage)).map(check))

    })
  })

  describe('addProperty', function (){

    before(async function () {
      this.instance = await RealEstateMarket.new()
      this.fakePropertyData = createFakePropertyData()
    })

    it('should add a property for sale', async function (){

      const account = chance.pickone(accounts)

      await addProperty(this.fakePropertyData, account, this.instance)

      await expect(this.instance.properties.call(0)).to.be.fulfilled.then(v => {
        expect(v.forSale).to.be.true
        expect(v.ownerAddress).to.equal(account.toString())
      })

    })

  })

  describe('buyProperty', function (){

    before(async function () {
      this.instance = await RealEstateMarket.new()
      this.fakePropertyData = createFakePropertyData()
      await addProperty(this.fakePropertyData, accounts[0], this.instance)
    })

    it('should buy a property', async function (){

      const buyer = accounts[chance.integer({ min: 1, max: accounts.length - 1 })]

      await this.instance.buyProperty.sendTransaction(0, { 
        from: buyer, 
        value: this.fakePropertyData.price
      })

      await expect(this.instance.properties.call(0)).to.be.fulfilled.then(v => {
        expect(v.forSale).to.be.false
        expect(v.ownerAddress).to.equal(buyer.toString())
      })

    })

  })

})
