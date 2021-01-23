import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl flex mx-auto">
                <div className=" px-6 py-4">
                    <Link to={'/'} className="text-3xl font-bold text-yellow-600">Zizounco</Link>
                </div>
                <div className="space-x-5 flex">
                    <NavLink exact to="/" activeClassName="text-gray-900 border-b-2 border-yellow-600" className="inline-flex items-center px-1 pt-1 text-md font-medium text-gray-500 focus:outline-none hover:text-gray-700">Estate</NavLink>
                    <NavLink to="/create" activeClassName="text-gray-900 border-b-2 border-yellow-600" className="inline-flex items-center px-1 pt-1 text-md font-medium text-gray-500 focus:outline-none hover:text-gray-700">Sell</NavLink>
                </div>
            </div>
        </nav>
    )
}

export default Navbar