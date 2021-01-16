import React, {useState} from 'react'
import { Formik } from 'formik'

const AddEstate = ({contract, accounts, askReload, web3}) => {

    const defaultValue = {'price': 0, 'description': '', 'location': ''}
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    return (
        <div>
            <h1>Add a new estate</h1>
            {isError && (
                <div className="error">{errorMessage}</div>
            )}
            {isSuccess && (
                <div className="error">Your estate has been added</div>
            )}
            <Formik 
                initialValues={defaultValue}
                onSubmit={async (values) => {
                    setIsError(false)
                    setIsSuccess(false)
                    try {

                        await contract.methods.addProperty(
                            web3.utils.toWei(values.price), 
                            values.location, 
                            values.description, 
                            [], 
                            []
                        ).send({ from: accounts[0] })

                        setIsSuccess(true)
                        askReload()

                    }catch(e){

                        console.log(e)

                        setIsError(true)
                        setErrorMessage("Cannot add your estate")
                    }
                    
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.location}
                            />
                            {errors.location && touched.location && errors.location}
                        </div>
                        <div>
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
                            {errors.description && touched.description && errors.description}
                        </div>
                        <div>
                            <label>Price</label>
                            <input
                                type="text"
                                name="price"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.price}
                            />
                            {errors.price && touched.price && errors.price}
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                        {/* <button type="button" onClick={askReload}>Reload list</button> */}
                    </form>
                )}
            </Formik>
        </div>
    )
} 

export default AddEstate