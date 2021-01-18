import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom';

const PropertyPage = ({contract, accounts, web3}) => {
    const queryString = useParams();
    let [property, setProperty] = useState(0);

    useEffect(() => {
        const getPropertyInfos = async () => {
                const propertiesStat = await contract.methods.paginateProperties(0).call();
                //console.log(propertiesStat)
                let result = propertiesStat.items.find(e => e.location == queryString.propertyName)
                console.log("Property found", result)
                setProperty(result)
        }

        getPropertyInfos()
    }, [])
    

    return (
        <div>
            <Link to='/'>Home</Link>
            <div class="center-div">
                {property !== null && property !== undefined && (
                    <div>
                        {
                console.log("property.forSale", property.forSale)}
                        <h3>Address : {property.location}</h3>
                        <h3>Price : {property.price}</h3>
                        <h3>Description : {property.description}</h3>
                        <h3>For sale : {new Boolean(property.forSale).toString()}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PropertyPage