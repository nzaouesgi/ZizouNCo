import React, {useState} from 'react'
import { Formik } from 'formik'
import Presentation from './components/Presentation'

const AddEstate = ({contract, accounts, web3}) => {

    const defaultValue = {'price': 0, 'description': '', 'location': ''}
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    return (
        <Presentation title="Add new estate">
            <div className="shadow-md mx-auto bg-white p-8 sm:max-w-lg space-y-4 rounded-md">
                {isError && (
                    <div className="alert bg-red-600">{errorMessage}</div>
                )}
                {isSuccess && (
                    <div className="alert bg-green-600">Your estate has been added</div>
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

                        }catch(e){

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
                                <label className="block text-md font-medium">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="w-full my-2 rounded-md border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-3 focus:ring-yellow-300"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.location}
                                />
                                {errors.location && touched.location && errors.location}
                            </div>
                            <div>
                                <label className="block text-md font-medium">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    className="w-full my-2 rounded-md border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-3 focus:ring-yellow-300"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                                {errors.description && touched.description && errors.description}
                            </div>
                            <div>
                                <label className="block text-md font-medium">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    className="w-full my-2 rounded-md border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-3 focus:ring-yellow-300"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.price}
                                />
                                {errors.price && touched.price && errors.price}
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-4 py-2 border mt-4 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-400 focus:border-yellow-700"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </Formik>
            </div>
        </Presentation>
    )
} 

export default AddEstate