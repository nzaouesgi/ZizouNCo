import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom"
import Presentation from './components/Presentation'
import { getFile, downloadFile, verifyDigest } from './files';

const PropertyPage = ({contract, accounts, web3}) => {
    const {propertyIndex} = useParams();
    const [property, setProperty] = useState({});
    const [documents, setDocument] = useState([]);
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("");
    const [isDowloadFile, setIsDowloadFile] = useState(false)

    useEffect(() => {
        const getPropertyInfos = async () => {
                setIsError(false)
                setIsLoading(true)
                setIsDowloadFile(false)

                try {

                    const property = await contract.methods.properties(propertyIndex).call().catch(() => Promise.reject("Can't get property"))

                    const documents = await contract.methods.getPropertyDocuments(propertyIndex).call()
                        .then(result => Promise.all(
                            result.map(document => getFile(document.identifier).then(fileContent => {return {integrity: document.integrity, ...fileContent}}))
                        ))
                        .catch(() => Promise.reject("Can't get property document"))
                    
                    // console.log(documents)

                    setProperty(property)
                    setDocument(documents)

                }catch(e){
                    
                    setErrorMessage(e)
                    setIsError(true)
                }finally {
                    setIsLoading(false)
                }
                
        }

        getPropertyInfos()
    }, [contract.methods, propertyIndex])

    const handleDownloadFile = async ({content, name, integrity}) => {
        try {
            
            setIsDowloadFile(true)
            const valid = await verifyDigest(content, new Uint8Array(web3.utils.hexToBytes(integrity)).buffer)
            if(valid)
                downloadFile(content, name)
            else {
                throw new Error("Invalid file integrity")
            }
        
        }catch (e) {

            setErrorMessage("Cannot check the integrity of your file")
            setIsError(true)

        }finally {
            setIsDowloadFile(false)
        }
        
    }

    return (
        <Presentation title="Detail" goBack>
            <div className="shadow-md mx-auto bg-white p-8 sm:max-w-lg space-y-4 rounded-md">
                {!isLoading && isError && (
                    <div className="alert bg-red-600">{errorMessage}</div>
                )}
                {isLoading && (
                    <div className="alert bg-yellow-600">...Loading</div>
                )}
                {isDowloadFile && (
                    <div className="alert bg-green-600">...Preparing your file"</div>
                )}
                {!isLoading && !isError && (
                    <div>
                        <div>
                            <div className=" text-md font-semibold">Address:</div>
                            <div className="my-2">{property.location}</div>
                        </div>
                        <div>
                            <div className=" text-md font-semibold">Price:</div>
                            <div className="my-2">{`${web3.utils.fromWei(property.price)} ethers`}</div>
                        </div>
                        <div>
                            <div className=" text-md font-semibold">Description:</div>
                            <div className="my-2">{property.description}</div>
                        </div>
                        <div>
                            <div className=" text-md font-semibold">For sale:</div>
                            <input className="my-2" type="checkbox" checked={Boolean(property.forSale)} readOnly></input>
                        </div>
                        <div>
                            <div className=" text-md font-semibold">Documents:</div>
                            {documents.length > 0 ? (
                                <div className="flex flex-wrap space-x-3 my-2">
                                    {documents.map(document => (
                                        <button key={document.code} onClick={() => handleDownloadFile(document)} title="Download"
                                            className="rounded-full border-yellow-600 text-yellow-600 border px-3 py-2 hover:text-white hover:bg-yellow-600 focus:outline-none focus:text-white focus:bg-yellow-600"
                                        >
                                            {document.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 my-2 text-sm">No files attached</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Presentation>
    )
}

export default PropertyPage