import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="text-center py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Hotel
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Book amazing hotels at the best prices
            </p>
            <Link
                to="/hotels"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
                Browse Hotels
            </Link>
        </div>
    );
};

export default HomePage;