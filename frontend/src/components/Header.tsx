import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link 
                        to="/" 
                        className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        HotelBooking
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        <Link 
                            to="/" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/') 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/hotels" 
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive('/hotels') 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                            }`}
                        >
                            Hotels
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 animate-slide-down">
                        <div className="flex flex-col space-y-2 pt-4">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isActive('/')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/hotels"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isActive('/hotels')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                Hotels
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;