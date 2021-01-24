import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import Presentation from './components/Presentation'
// import Property from "./models"

const ListEstate = ({contract, accounts, web3}) => {

    const itemsPerPage = 25;
    const [estateListe, setEstateList] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [statusMessage, setStatusMessage] = useState("")
    const [askBuying, setAskBuying] = useState(false)

    useEffect(() => {
        const getContract = async () => {
                setIsError(false)
                setIsSuccess(false)
                setIsLoading(true)

                try {

                    let propertiesStat = await contract.methods.paginateProperties(currentPage).call();
                    const totalCurrentPage = parseInt(propertiesStat.itemsCount);
                    const totalAllData = parseInt(propertiesStat.itemsTotal)

                    setEstateList(list => list.concat(propertiesStat.items.slice(0, totalCurrentPage)))
                    setTotalPage(totalAllData > 0 ? Math.ceil(totalAllData / itemsPerPage) - 1 : 0)

                }catch(e){

                    setIsError(true)
                    setStatusMessage("Cannot get property data")

                }finally {
                    setIsLoading(false)
                }
        }

        getContract()

    }, [contract, currentPage])

    const handleBuyEstate = (estateIndex, {price, location}) => {
        setIsError(false)
        setIsSuccess(false)
        setIsLoading(false)
        setAskBuying(true)

        contract.methods
            .buyProperty(estateIndex)
            .send({ from: accounts[0], value: price})
            .then(() => setIsLoading(true))
            .then(() => Promise.all(estateListe.map((item, index) => {

                if(index === estateIndex)
                    return contract.methods.properties(estateIndex).call()

                return Promise.resolve({...item})
            })))
            .then(estate => {
                setEstateList(estate)
                setStatusMessage(`You succesfully buying estate at ${location} for ${web3.utils.fromWei(price)} ethers`)
                setIsSuccess(true)
            })
            .catch(e => {
                setStatusMessage(`Cannot complete buying process at ${location} for ${web3.utils.fromWei(price)} ethers`)
                setIsError(true)
            })
            .finally(() => {
                setIsLoading(false)
                setAskBuying(false)
            })
        
    }

    return (
        <Presentation title="Estate" displayMessage message="ZizouNCo offers you the best estates in the market">
            {(isError || isSuccess) && (
                    <div className={`alert ${isError && 'bg-red-600'} ${isSuccess && 'bg-green-600'}`}>{statusMessage}</div>
            )}
            {isLoading && (
                    <div className="alert bg-yellow-600">..Loading</div>
            )}
            <div className="my-3 text-md font-medium">{`Page ${currentPage + 1}/${totalPage + 1}`}</div>
            { estateListe.length > 0 && (
                <div className="grid gap-5 md:gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grids-col-4">
                    {estateListe
                        .map((estate, index) => (
                            <div className="max-w-sm rounded-lg shadow-lg bg-white py-5 px-8" key={index}>
                                <div className="font-bold text-xl mb-2 capitalize">{estate.location}</div>
                                <p className="text-gray-500 text-base">{estate.description}</p>
                                <div className="mt-4">{`${web3.utils.fromWei(estate.price)} ethers`}</div>
                                {estate.ownerAddress === accounts[0] && (
                                    <div className="text-gray-500 text-sm mt-4">You're the owner of the estate</div>
                                )}
                                <div className="space-x-6 mt-6">
                                    {(estate.forSale || estate.ownerAddress === accounts[0]) && (
                                        <Link to={'/property/' + index} className="bg-blue-500 rounded-md font-medium px-4 py-2 text-sm leading-5 text-white hover:bg-blue-400">
                                            Info
                                        </Link>
                                    )}
                                    {estate.forSale && estate.ownerAddress !== accounts[0] && (
                                        <button disabled={askBuying} onClick={() => handleBuyEstate(index, estate)} className="bg-yellow-500 rounded-md font-medium px-4 py-2 text-sm leading-5 text-white hover:bg-yellow-400 disabled:opacity-50">
                                            Buy
                                        </button>
                                    )}
                                    {!estate.forSale && estate.ownerAddress !== accounts[0] && (
                                        <div className="text-green-600 text-sm">This estate is already sold</div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
            { !isLoading && estateListe.length < 0 && (
                <div className="alert bg-yellow-500">
                    No estate
                </div>
            )}
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