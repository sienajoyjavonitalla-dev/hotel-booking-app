import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-blue-400 mb-4">HotelBooking</h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted partner for finding the perfect hotel experience. 
                            Book with confidence and enjoy your stay.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/hotels" className="text-gray-400 hover:text-white transition-colors">
                                    Browse Hotels
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: support@hotelbooking.com</li>
                            <li>Phone: +1 (555) 123-4567</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
                    <p>&copy; 2026 Hotel Booking App. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;