import React, {useEffect, useState} from 'react'

const ListEstate = (props) => {

    const {contract, accounts} = props;
    const [setEstateList, estateListe] = useState([])

    useEffect(() => {

        const getContract = async () => {

            // await contract.methods.addProperty(1, 
            //     'blablabla', 
            //     'blablabla', 
            //     [], 
            //     []
            // ).send({ from: accounts[0] })

            console.log(await contract.methods.properties(0).call())
            console.log(await contract.methods.properties)
        }

        getContract()
        

    }, [estateListe, contract])

    return (
        <h1>Test</h1>
    )
}


export default ListEstate