import React, { Component} from "react";
import RealEstateMarketContract from "./contracts/RealEstateMarketContract.json";
import getWeb3 from "./getWeb3";
import ListEstate from './ListEstate';
import AddEstate from './AddEstate'

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, reloadList: true};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RealEstateMarketContract.networks[networkId];

      const instance = new web3.eth.Contract(
        RealEstateMarketContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Estate</h1>
        <ListEstate 
          accounts={this.state.accounts} 
          contract={this.state.contract} 
          reload={this.state.reloadList}
          endReload={() => this.setState({reloadList: false})}
          web3={this.state.web3}
        />
        <AddEstate 
          accounts={this.state.accounts} 
          contract={this.state.contract} 
          askReload={() => this.setState({reloadList: true})}
          web3={this.state.web3}
        />
      </div>
    );
  }
}

export default App;
