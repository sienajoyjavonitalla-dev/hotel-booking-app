import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService, Hotel } from '../services/hotelService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const HotelListPage: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await hotelService.getHotels();
                setHotels(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load hotels';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                console.error('Error fetching hotels:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [showToast]);

    if (loading) {
        return <LoadingSpinner text="Loading hotels..." />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-800 font-semibold mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (hotels.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">🏨</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Hotels Available</h2>
                    <p className="text-gray-600 mb-6">We're currently updating our hotel listings. Please check back soon!</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Available Hotels</h1>
                <p className="text-gray-600">Discover your perfect stay from our curated selection</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <Link
                        key={hotel.id}
                        to={`/hotels/${hotel.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                    >
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative overflow-hidden">
                            {hotel.images && hotel.images.length > 0 ? (
                                <img
                                    src={hotel.images[0]}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="text-white text-6xl opacity-50">🏨</div>
                            )}
                            <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="text-yellow-400 text-sm">★</span>
                                <span className="text-gray-900 font-semibold text-sm">{hotel.rating}</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {hotel.name}
                            </h2>
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">{hotel.address}</p>
                            {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                    {hotel.amenities.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                            +{hotel.amenities.length - 3} more
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-blue-600 font-semibold">View Details</span>
                                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HotelListPage;