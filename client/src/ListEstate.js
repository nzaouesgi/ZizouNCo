import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Presentation from './components/Presentation'
// import Property from "./models"

const ListEstate = ({contract, accounts, web3}) => {

    const itemsPerPage = 25;
    const [estateListe, setEstateList] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    const buyEstate = async (index, price) => {
        await contract.methods
            .buyProperty(index)
            .send({ from: accounts[0], value: price})
    }

    useEffect(() => {
        const getContract = async () => {

                console.log("Effect")

                let propertiesStat = await contract.methods.paginateProperties(currentPage).call();
                const totalCurrentPage = parseInt(propertiesStat.itemsCount);
                const totalAllData = parseInt(propertiesStat.itemsTotal)

                setEstateList(list => list.concat(propertiesStat.items.slice(0, totalCurrentPage)))
                setTotalPage(Math.ceil(totalAllData / itemsPerPage) - 1)
        }

        getContract()

    }, [contract, currentPage])

    return (
        <Presentation title="Estate" displayMessage message="Zizounco offer you best estates of the market">
            <div className="my-3 text-md font-medium">{`Page ${currentPage + 1}/${totalPage + 1}`}</div>
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
                <div className="alert bg-yellow-500">
                    No estate
                </div>
            }
            {currentPage < totalPage && (
                <div className="mt-3 text-center">
                    <button
                        onClick={() => setCurrentPage(c => c + 1)}
                        className="px-4 py-2 border mt-4 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-400 focus:border-yellow-700"
                    >
                        Show more
                    </button>
                </div>
            )}
        </Presentation>
    )
}


export default ListEstate