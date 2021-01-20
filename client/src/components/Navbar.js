import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="bg-white shadow">
            <div className="max-w-7xl px-6 py-4 mx-auto">
                <Link to={'/'} className="text-3xl font-bold text-yellow-600">Zizounco</Link>
            </div>
        </div>
    )
}

export default Navbar