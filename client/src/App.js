import React, { Component } from "react";
import RealEstateMarket from "./contracts/RealEstateMarket.json";
import getWeb3 from "./getWeb3";
import ListEstate from "./ListEstate";
import AddEstate from "./AddEstate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PropertyPage from "./PropertyPage";
import NoMatch from "./NoMatch";
import Navbar from "./components/Navbar"
import './assets/output.css'

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    reloadList: true,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RealEstateMarket.networks[networkId];

      const instance = new web3.eth.Contract(
        RealEstateMarket.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <Router>
        <Navbar/>
          <div className="min-h-screen px-4 py-16 lg:py-20 lg:px-12">
            <div className="max-w-7xl mx-auto">

            <Switch>
              <Route exact path="/">
                  <div className="text-center">
                    <h1 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">Estate</h1>
                    <p className="my-4 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">Zizounco offer you best estates of the market</p>
                  </div>
                  <div className="mt-12">
                    <ListEstate
                      accounts={this.state.accounts}
                      contract={this.state.contract}
                      reload={this.state.reloadList}
                      endReload={() => this.setState({ reloadList: false })}
                      web3={this.state.web3}
                    />
                    {/* <AddEstate
                      accounts={this.state.accounts}
                      contract={this.state.contract}
                      askReload={() => this.setState({ reloadList: true })}
                      web3={this.state.web3}
                    /> */}
                  </div>
              </Route>
              <Route
                path="/property/:propertyName"
                children={
                  <PropertyPage
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    web3={this.state.web3}
                  />
                }
              />
              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
            </div>
        </div>
      </Router>
    );
  }
}

export default App;
