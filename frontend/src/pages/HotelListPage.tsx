import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService, Hotel } from '../services/hotelService';

const HotelListPage: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await hotelService.getHotels();
                setHotels(data);
            } catch (err) {
                setError('Failed to load hotels');
                console.error('Error fetching hotels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading hotels...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Hotels</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Hotel Image</span>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h2>
                            <p className="text-gray-600 mb-2">{hotel.address}</p>
                            <div className="flex items-center mb-4">
                                <span className="text-yellow-400">★</span>
                                <span className="ml-1 text-gray-700">{hotel.rating}</span>
                            </div>
                            <Link
                                to={`/hotels/${hotel.id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelListPage;