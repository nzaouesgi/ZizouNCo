import React, {useEffect, useState} from 'react'

const ListEstate = ({contract, reload, accounts, endReload, web3}) => {

    const [estateListe, setEstateList] = useState([])

    const buyEstate = async (index, price) => {
        await contract.methods
            .buyProperty(index)
            .send({ from: accounts[0], value: web3.utils.toWei(price)})
    }

    useEffect(() => {

        const getContract = async () => {

            if(reload){

                const numberOfProperties = await contract.methods.countProperties().call()
                const allProperties = []
    
                if(numberOfProperties > 0){
    
                    for (const index of Array(parseInt(numberOfProperties)).keys()){
    
                        const property = await contract.methods.properties(index).call()
                        // console.log(property)
                        allProperties.push(property)
                    }
    
                    setEstateList(allProperties)
                }

                endReload()
            }
        }

        getContract()
        

    }, [contract, reload, endReload])

    return (
        <div>
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
                                    <td>{estate.price}</td>
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