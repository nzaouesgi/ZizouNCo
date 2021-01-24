import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';
import Presentation from './components/Presentation'
import { getFile } from './files';

const PropertyPage = ({contract, accounts, web3}) => {
    const queryString = useParams();
    let [property, setProperty] = useState(0);
    let [documents, setDocument] = useState({});

    useEffect(() => {
        const getPropertyInfos = async () => {
                
                const property = await contract.methods.properties(queryString.propertyIndex).call()

                const documents = await contract.methods.documents(0).call()
                //console.log("documents", documents)

                setProperty(property)
                setDocument(documents)
        }

        getPropertyInfos()
    }, [contract.methods, queryString])

    useEffect(() => {
        console.log("documents TEST", documents)
        if (documents !== undefined) {
            getFile(documents.identifier)
            .then(file => {
                console.log("Got a file", file)
            }).catch(err => console.error(err))
        }
    }, [documents])
    

    return (
        <Presentation title="Detail">
            <div className="center-div">
                {property !== null && property !== undefined && (
                    <div>
                        <h3>Address : {property.location}</h3>
                        <h3>Price : {property.price}</h3>
                        <h3>Description : {property.description}</h3>
                        <h3>For sale : {Boolean(property.forSale).toString()}</h3>
                        {/* {console.log(property)} */}
                        { documents !== undefined ? 
                            <div>

                            </div>
                            :
                            <div>
                                No documents attached
                            </div>
                        }
                    </div>
                )}
            </div>
        </Presentation>
    )
}

export default PropertyPage