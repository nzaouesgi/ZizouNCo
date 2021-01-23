import React from 'react'

const Presentation = ({children, title, displayMessage, message = false}) => {

    return (
        <div>
            <div className="text-center">
                <h1 className="text-3xl leading-9 tracking-tight font-extrabold text-gray-900 sm:text-4xl sm:leading-10">{title}</h1>
                { displayMessage && <p className="my-4 max-w-2xl mx-auto text-xl leading-7 text-gray-500 sm:mt-4">{message}</p>}
            </div>
            <div className="mt-12">
                {children}
            </div>
        </div>
    )
}

export default Presentation