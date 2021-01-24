import React, {useState} from 'react'
import { Formik } from 'formik'
import Presentation from './components/Presentation'
import { computeDigest, uploadFile } from './files'

const AddEstate = ({contract, accounts, web3}) => {

    const defaultValue = {'price': 0, 'description': '', 'location': '', 'files': []}
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Presentation title="Sell an estate" goBack>
            <div className="shadow-md mx-auto bg-white p-8 sm:max-w-lg space-y-4 rounded-md">
                {!isLoading && isError && (
                    <div className="alert bg-red-600">{errorMessage}</div>
                )}
                {!isLoading && isSuccess && (
                    <div className="alert bg-green-600">Your estate has been added</div>
                )}
                {isLoading && (
                    <div className="alert bg-yellow-500 space-x-3">
                        ..Loading
                    </div>
                )}
                <Formik 
                    initialValues={defaultValue}
                    onSubmit={async (values) => {
                        setIsError(false)
                        setIsSuccess(false)
                        setIsLoading(true)
                        try {
                            const findFiles = Array.from(values.files)

                            const filesId = await Promise.all(findFiles.map(file => uploadFile(file)))
                            const filesDigests = await Promise.all(findFiles.map(file => computeDigest(file))).then(digests => digests.map(digest => web3.utils.bytesToHex(new Uint8Array(digest))))

                            // console.log("filesId", filesId)
                            // console.log("filesDigests", filesDigests)

                            await contract.methods.addProperty(
                                web3.utils.toWei(values.price), 
                                values.location, 
                                values.description, 
                                filesId, 
                                filesDigests
                            ).send({ from: accounts[0] })

                            setIsSuccess(true)

                        }catch(e){

                            setIsError(true)
                            console.error(e)
                            setErrorMessage("Cannot add your estate")
                        }finally{
                            setIsLoading(false)
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
                        isSubmitting,
                        setFieldValue
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
                            <div>
                                <label className="block text-md font-medium">Documents</label>
                                <input
                                    type="file"
                                    multiple={true}
                                    name="files"
                                    className="w-full my-2 rounded-md border-gray-300 focus:border-yellow-300 focus:outline-none focus:ring-3 focus:ring-yellow-300"
                                    onBlur={handleBlur}
                                    onChange={(event) => {
                                        setFieldValue("files", event.currentTarget.files);
                                    }}
                                />
                                {errors.files && touched.files && errors.files}
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 border mt-4 border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-400 focus:border-yellow-700 disabled:opacity-50"
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