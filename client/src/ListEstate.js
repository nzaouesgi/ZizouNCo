import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
// import Property from "./models"

const ListEstate = ({contract, reload, accounts, endReload, web3}) => {

    const itemsPerPage = 25;
    const [estateListe, setEstateList] = useState([])

    const buyEstate = async (index, price) => {
        await contract.methods
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
                // console.log("numberOfProperties", propertiesStat)

                endReload()
            }
        }

        getContract()
        

    }, [reload, endReload, contract])

    return (
        <div className="">
            { estateListe.length > 0 ? 
                <div className="grid gap-5 md:gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grids-col-4">
                    {estateListe
                        .filter(estate => estate.forSale)
                        .map((estate, index) => (
                            <div className="max-w-sm rounded-lg shadow-lg bg-white py-5 px-8" key={index}>
                                <div className="font-bold text-xl mb-2 capitalize">{estate.location}</div>
                                <p className="text-gray-500 text-base">{estate.description}</p>
                                <div className="mt-4">{`${web3.utils.fromWei(estate.price)} ethers`}</div>
                                <div className="space-x-6 mt-6">
                                    <Link to={'/property/' + estate.location} className="bg-blue-500 rounded-md font-medium px-4 py-2 text-sm leading-5 text-white hover:bg-blue-400">
                                        Info
                                    </Link>
                                    {estate.ownerAddress !== accounts[0] && (
                                        <button onClick={() => buyEstate(index, estate.price)} className="bg-yellow-500 rounded-md font-medium px-4 py-2 text-sm leading-5 text-white hover:bg-yellow-400">
                                            Buy
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
                :
                <div className="px-4 py-4 mx-auto bg-yellow-500 text-white font-medium rounded-md">
                    No estate
                </div>
            }
        </div>
    )
}


export default ListEstate