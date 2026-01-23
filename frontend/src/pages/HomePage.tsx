import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center px-4 py-16">
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Find Your Perfect
                        <span className="text-blue-600 block">Hotel Experience</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Discover amazing hotels at unbeatable prices. Book your dream stay with just a few clicks.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <Link
                        to="/hotels"
                        className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Browse Hotels
                    </Link>
                    <Link
                        to="/hotels"
                        className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    >
                        View Deals
                    </Link>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl mb-4">🏨</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Hotels</h3>
                        <p className="text-gray-600">Carefully selected premium accommodations</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
                        <p className="text-gray-600">Competitive rates with no hidden fees</p>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl mb-4">✨</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
                        <p className="text-gray-600">Simple and secure booking process</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;