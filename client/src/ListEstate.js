import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Property from "./models"

const ListEstate = ({contract, reload, accounts, endReload, web3}) => {

    const itemsPerPage = 25;
    const [estateListe, setEstateList] = useState([])

    const buyEstate = async (index, price) => {
        let result = await contract.methods
            .buyProperty(index)
            .send({ from: accounts[0], value: price})
    }

    useEffect(() => {
        const getContract = async () => {

            if(reload){
                let currentPage = 0;

                let propertiesStat = await contract.methods.paginateProperties(currentPage).call();
                const allProperties = [];
                const totalPropertiesCount = parseInt(propertiesStat["itemsCount"]); 

                for(let j = 0; j <= Math.trunc(totalPropertiesCount / itemsPerPage) ; j++) {
                    for(let i = 0; i < totalPropertiesCount; i++) {
                        allProperties.push(propertiesStat.items[i])
                    }
                    currentPage++;
                    propertiesStat = await contract.methods.paginateProperties(currentPage).call();
                }
                if (totalPropertiesCount > 0) {
                    setEstateList(allProperties);
                }
                console.log("numberOfProperties", propertiesStat)

                endReload()
            }
        }

        getContract()
        

    }, [])

    return (
        <div class="center-div">
            { estateListe.length > 0 ? 
                <table>
                    <thead>
                        <tr>
                            <th>Location</th>
                            <th>Description</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estateListe
                            .filter(estate => estate.forSale)
                            .map((estate, index) => (
                                <tr key={index}>
                                    <td>{estate.location}</td>
                                    <td>{estate.description}</td>
                                    <td>{web3.utils.fromWei(estate.price)}</td>
                                    <td><Link to={'/property/' + estate.location}>More Info</Link></td>
                                    {estate.ownerAddress !== accounts[0] && (
                                        <td>
                                            <button 
                                                onClick={() => buyEstate(index, estate.price)}>
                                                Buy
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                :
                <h4>No estate</h4>
            }
        </div>
    )
}


export default ListEstate