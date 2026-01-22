import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        HotelBooking
                    </Link>
                    <nav className="space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/hotels" className="text-gray-600 hover:text-blue-600">
                            Hotels
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;