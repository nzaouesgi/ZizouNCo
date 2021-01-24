import React from 'react'
import { useHistory } from "react-router-dom";

const Presentation = ({children, title, displayMessage, message = false, goBack = false}) => {
    const history = useHistory()

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">{title}</h1>
                { displayMessage && <p className="my-4 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">{message}</p>}
            </div>
            {goBack && (
                <div>
                    <button onClick={history.goBack} className="font-semibold text-lg space-x-2 px-2 py-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" className="inline-flex">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="inline-flex">Back</span>
                    </button>
                </div>
            )}
            <div className="mt-12">
                {children}
            </div>
        </div>
    )
}

export default Presentation